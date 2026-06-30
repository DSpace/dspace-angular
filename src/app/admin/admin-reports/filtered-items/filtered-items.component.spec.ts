import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CollectionDataService } from '@dspace/core/data/collection-data.service';
import { CommunityDataService } from '@dspace/core/data/community-data.service';
import { AuthorizationDataService } from '@dspace/core/data/feature-authorization/authorization-data.service';
import { MetadataFieldDataService } from '@dspace/core/data/metadata-field-data.service';
import { MetadataSchemaDataService } from '@dspace/core/data/metadata-schema-data.service';
import { ScriptDataService } from '@dspace/core/data/processes/script-data.service';
import { DspaceRestService } from '@dspace/core/dspace-rest/dspace-rest.service';
import { Collection } from '@dspace/core/shared/collection.model';
import { Community } from '@dspace/core/shared/community.model';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';

import { FilteredItemsComponent } from './filtered-items.component';

describe('FilteredItemsComponent', () => {
  let component: FilteredItemsComponent;
  let fixture: ComponentFixture<FilteredItemsComponent>;

  let communityService: jasmine.SpyObj<CommunityDataService>;
  let collectionService: jasmine.SpyObj<CollectionDataService>;
  let metadataSchemaService: jasmine.SpyObj<MetadataSchemaDataService>;
  let metadataFieldService: jasmine.SpyObj<MetadataFieldDataService>;
  let scriptDataService: jasmine.SpyObj<ScriptDataService>;
  let authorizationDataService: jasmine.SpyObj<AuthorizationDataService>;
  let restService: jasmine.SpyObj<DspaceRestService>;

  const communityA = Object.assign(new Community(), {
    uuid: 'community-a',
    name: 'Community A',
  });

  const communityB = Object.assign(new Community(), {
    uuid: 'community-b',
    name: 'Community B',
  });

  const collectionA1 = Object.assign(new Collection(), {
    uuid: 'collection-a1',
    name: 'Collection A1',
    metadata: {
      'dspace.entity.type': [{ value: 'Publication' }],
    },
  });

  const collectionA2NonPub = Object.assign(new Collection(), {
    uuid: 'collection-a2',
    name: 'Collection A2 (non publication)',
    metadata: {
      'dspace.entity.type': [{ value: 'Person' }],
    },
  });

  const collectionB1 = Object.assign(new Collection(), {
    uuid: 'collection-b1',
    name: 'Collection B1',
    metadata: {
      'dspace.entity.type': [{ value: 'Publication' }],
    },
  });

  function initServices(): void {
    communityService = jasmine.createSpyObj('communityService', {
      findAll: createSuccessfulRemoteDataObject$({
        page: [communityA, communityB],
        totalElements: 2,
      } as any),
    });

    collectionService = jasmine.createSpyObj('collectionService', {
      findByParent: createSuccessfulRemoteDataObject$({ page: [] } as any),
    });
    // Different return values per community uuid
    collectionService.findByParent.and.callFake((parentUuid: string) => {
      if (parentUuid === communityA.uuid) {
        return createSuccessfulRemoteDataObject$({
          page: [collectionA1, collectionA2NonPub],
          totalElements: 2,
        } as any);
      }
      if (parentUuid === communityB.uuid) {
        return createSuccessfulRemoteDataObject$({
          page: [collectionB1],
          totalElements: 1,
        } as any);
      }
      return createSuccessfulRemoteDataObject$({ page: [], totalElements: 0 } as any);
    });

    metadataSchemaService = jasmine.createSpyObj('metadataSchemaService', {
      findAll: createSuccessfulRemoteDataObject$({ page: [], totalElements: 0 } as any),
    });

    metadataFieldService = jasmine.createSpyObj('metadataFieldService', {
      findBySchema: createSuccessfulRemoteDataObject$({ page: [], totalElements: 0 } as any),
    });

    scriptDataService = jasmine.createSpyObj('scriptDataService', {
      findById: createSuccessfulRemoteDataObject$(null),
    });
    authorizationDataService = jasmine.createSpyObj('authorizationDataService', ['isAuthorized']);
    restService = jasmine.createSpyObj('restService', ['request']);
  }

  beforeEach(waitForAsync(async () => {
    initServices();

    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ReactiveFormsModule,
        FilteredItemsComponent,
      ],
      providers: [
        { provide: CommunityDataService, useValue: communityService },
        { provide: CollectionDataService, useValue: collectionService },
        { provide: MetadataSchemaDataService, useValue: metadataSchemaService },
        { provide: MetadataFieldDataService, useValue: metadataFieldService },
        { provide: ScriptDataService, useValue: scriptDataService },
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: DspaceRestService, useValue: restService },
      ],
    }).overrideComponent(FilteredItemsComponent, {
      remove: { imports: [] },
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteredItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('loadCollections', () => {

    it('should populate collectionGroups grouped by community name', () => {
      expect(component.collectionGroups.length).toBe(2);
      expect(component.collectionGroups[0].communityName).toBe('Community A');
      expect(component.collectionGroups[1].communityName).toBe('Community B');
    });

    it('should only include collections with dspace.entity.type Publication', () => {
      const groupA = component.collectionGroups.find(g => g.communityName === 'Community A');
      expect(groupA.collections.length).toBe(1);
      expect(groupA.collections[0].id).toBe('collection-a1');
    });

    it('should not include communities as selectable collections in the flat collections array', () => {
      const communityIds = component.collections.map(c => c.id);
      expect(communityIds).not.toContain(communityA.uuid);
      expect(communityIds).not.toContain(communityB.uuid);
    });

    it('should include the Whole Repository option in collections', () => {
      expect(component.collections.some(c => c.id === '')).toBeTrue();
    });

    it('should not include groups with zero matching collections', () => {
      // No community without any "Publication" collection should appear
      const groupNames = component.collectionGroups.map(g => g.communityName);
      expect(groupNames).not.toContain('Empty Community');
    });

  });

  describe('toggleCollection', () => {

    it('should add a collection id when not previously selected', () => {
      component.queryForm.get('collections').setValue([]);
      component.toggleCollection('collection-a1');
      expect(component.queryForm.get('collections').value).toEqual(['collection-a1']);
    });

    it('should remove a collection id when already selected', () => {
      component.queryForm.get('collections').setValue(['collection-a1', 'collection-b1']);
      component.toggleCollection('collection-a1');
      expect(component.queryForm.get('collections').value).toEqual(['collection-b1']);
    });

    it('should allow multiple collections to be selected', () => {
      component.queryForm.get('collections').setValue([]);
      component.toggleCollection('collection-a1');
      component.toggleCollection('collection-b1');
      expect(component.queryForm.get('collections').value).toEqual(['collection-a1', 'collection-b1']);
    });

    it('should deselect specific collections when Whole Repository is selected', () => {
      component.queryForm.get('collections').setValue(['collection-a1', 'collection-b1']);
      component.toggleCollection('');
      expect(component.queryForm.get('collections').value).toEqual(['']);
    });

    it('should deselect Whole Repository when a specific collection is selected', () => {
      component.queryForm.get('collections').setValue(['']);
      component.toggleCollection('collection-a1');
      expect(component.queryForm.get('collections').value).toEqual(['collection-a1']);
    });

    it('should deselect Whole Repository when toggled twice', () => {
      component.queryForm.get('collections').setValue(['']);
      component.toggleCollection('');
      expect(component.queryForm.get('collections').value).toEqual([]);
    });

  });

  describe('isCollectionSelected', () => {

    it('should return true when the collection id is in the form value', () => {
      component.queryForm.get('collections').setValue(['collection-a1']);
      expect(component.isCollectionSelected('collection-a1')).toBeTrue();
    });

    it('should return false when the collection id is not in the form value', () => {
      component.queryForm.get('collections').setValue(['collection-a1']);
      expect(component.isCollectionSelected('collection-b1')).toBeFalse();
    });

    it('should return false when the form value is empty', () => {
      component.queryForm.get('collections').setValue([]);
      expect(component.isCollectionSelected('collection-a1')).toBeFalse();
    });

  });

});
