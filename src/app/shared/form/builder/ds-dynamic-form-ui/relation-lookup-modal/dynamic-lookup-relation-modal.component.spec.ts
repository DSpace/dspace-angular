import {
  DebugElement,
  NgZone,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  NgbActiveModal,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  of,
  Subscription,
} from 'rxjs';

import { APP_DATA_SERVICES_MAP } from '../../../../../../config/app-config.interface';
import { RemoteDataBuildService } from '../../../../../core/cache/builders/remote-data-build.service';
import { ExternalSourceDataService } from '../../../../../core/data/external-source-data.service';
import { LookupRelationService } from '../../../../../core/data/lookup-relation.service';
import { RelationshipDataService } from '../../../../../core/data/relationship-data.service';
import { Collection } from '../../../../../core/shared/collection.model';
import { ExternalSource } from '../../../../../core/shared/external-source.model';
import { Item } from '../../../../../core/shared/item.model';
import { SearchConfigurationService } from '../../../../../core/shared/search/search-configuration.service';
import { WorkspaceItem } from '../../../../../core/submission/models/workspaceitem.model';
import { XSRFService } from '../../../../../core/xsrf/xsrf.service';
import { BtnDisabledDirective } from '../../../../btn-disabled.directive';
import { ItemSearchResult } from '../../../../object-collection/shared/item-search-result.model';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { createSuccessfulRemoteDataObject$ } from '../../../../remote-data.utils';
import { PaginatedSearchOptions } from '../../../../search/models/paginated-search-options.model';
import { createPaginatedList } from '../../../../testing/utils.test';
import { RelationshipOptions } from '../../models/relationship-options.model';
import { DsDynamicLookupRelationModalComponent } from './dynamic-lookup-relation-modal.component';
import {
  AddRelationshipAction,
  RemoveRelationshipAction,
} from './relationship.actions';

describe('DsDynamicLookupRelationModalComponent', () => {
  let component: DsDynamicLookupRelationModalComponent;
  let fixture: ComponentFixture<DsDynamicLookupRelationModalComponent>;
  let debugElement: DebugElement;
  let item;
  let item1;
  let item2;
  let testWSI;
  let searchResult1;
  let searchResult2;
  let listID;
  let selection$;
  let selectableListService;
  let relationship;
  let nameVariant;
  let metadataField;
  let pSearchOptions;
  let externalSourceService;
  let lookupRelationService;
  let rdbService;
  let submissionId;

  const externalSources = [
    Object.assign(new ExternalSource(), {
      id: 'orcidV2',
      name: 'orcidV2',
      hierarchical: false,
    }),
    Object.assign(new ExternalSource(), {
      id: 'sherpaPublisher',
      name: 'sherpaPublisher',
      hierarchical: false,
    }),
  ];
  const totalLocal = 10;
  const totalExternal = 8;
  const collection: Collection = new Collection();


  function init() {
    item = Object.assign(new Item(), { uuid: '7680ca97-e2bd-4398-bfa7-139a8673dc42', metadata: {} });
    item1 = Object.assign(new Item(), { uuid: 'e1c51c69-896d-42dc-8221-1d5f2ad5516e' });
    item2 = Object.assign(new Item(), { uuid: 'c8279647-1acc-41ae-b036-951d5f65649b' });
    testWSI = new WorkspaceItem();
    testWSI.item = createSuccessfulRemoteDataObject$(item);
    testWSI.collection = createSuccessfulRemoteDataObject$(collection);
    searchResult1 = Object.assign(new ItemSearchResult(), { indexableObject: item1 });
    searchResult2 = Object.assign(new ItemSearchResult(), { indexableObject: item2 });
    listID = '6b0c8221-fcb4-47a8-b483-ca32363fffb3';
    selection$ = of([searchResult1, searchResult2]);
    selectableListService = { getSelectableList: () => selection$ };
    relationship = Object.assign(new RelationshipOptions(), {
      filter: 'filter',
      relationshipType: 'isAuthorOfPublication',
      nameVariants: true,
      searchConfiguration: 'personConfig',
      externalSources: ['orcidV2', 'sherpaPublisher'],
    });
    nameVariant = 'Doe, J.';
    metadataField = 'dc.contributor.author';
    pSearchOptions = new PaginatedSearchOptions({});
    externalSourceService = jasmine.createSpyObj('externalSourceService', {
      findAll: createSuccessfulRemoteDataObject$(createPaginatedList(externalSources)),
      findById: createSuccessfulRemoteDataObject$(externalSources[0]),
    });
    lookupRelationService = jasmine.createSpyObj('lookupRelationService', {
      getTotalLocalResults: of(totalLocal),
      getTotalExternalResults: of(totalExternal),
    });
    rdbService = jasmine.createSpyObj('rdbService', {
      aggregate: createSuccessfulRemoteDataObject$(externalSources),
    });
    submissionId = '1234';
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule, DsDynamicLookupRelationModalComponent, BtnDisabledDirective],
      providers: [
        {
          provide: SearchConfigurationService, useValue: {
            paginatedSearchOptions: of(pSearchOptions),
          },
        },
        { provide: ExternalSourceDataService, useValue: externalSourceService },
        { provide: LookupRelationService, useValue: lookupRelationService },
        {
          provide: SelectableListService, useValue: selectableListService,
        },
        {
          provide: RelationshipDataService, useValue: { getNameVariant: () => of(nameVariant) },
        },
        { provide: RemoteDataBuildService, useValue: rdbService },
        {
          provide: Store, useValue: {
            // eslint-disable-next-line no-empty, @typescript-eslint/no-empty-function
            dispatch: () => {
            },
          },
        },
        { provide: XSRFService, useValue: {} },
        { provide: NgZone, useValue: new NgZone({}) },
        { provide: APP_DATA_SERVICES_MAP, useValue: {} },
        NgbActiveModal,
        provideMockStore(),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsDynamicLookupRelationModalComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
    component.listId = listID;
    component.relationshipOptions = relationship;
    component.item = item;
    component.metadataFields = metadataField;
    component.submissionId = submissionId;
    component.isEditRelationship = true;
    component.currentItemIsLeftItem$ = of(true);
    component.toAdd = [];
    component.toRemove = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('close', () => {
    beforeEach(() => {
      spyOn(component.modal, 'close');
    });

    it('should call close on the modal', () => {
      component.close();
      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('select', () => {
    beforeEach(() => {
      spyOn((component as any).store, 'dispatch');
    });

    it('should dispatch an AddRelationshipAction for each selected object', () => {
      component.select(searchResult1, searchResult2);
      const action = new AddRelationshipAction(component.item, searchResult1.indexableObject, relationship.relationshipType, submissionId, nameVariant);
      const action2 = new AddRelationshipAction(component.item, searchResult2.indexableObject, relationship.relationshipType, submissionId, nameVariant);

      expect((component as any).store.dispatch).toHaveBeenCalledWith(action);
      expect((component as any).store.dispatch).toHaveBeenCalledWith(action2);
    });
  });

  describe('deselect', () => {
    beforeEach(() => {
      component.subMap[searchResult1.indexableObject.uuid] = new Subscription();
      component.subMap[searchResult2.indexableObject.uuid] = new Subscription();
      spyOn((component as any).store, 'dispatch');
    });

    it('should dispatch an RemoveRelationshipAction for each deselected object', () => {
      component.deselect(searchResult1, searchResult2);
      const action = new RemoveRelationshipAction(component.item, searchResult1.indexableObject, relationship.relationshipType, submissionId);
      const action2 = new RemoveRelationshipAction(component.item, searchResult2.indexableObject, relationship.relationshipType, submissionId);

      expect((component as any).store.dispatch).toHaveBeenCalledWith(action);
      expect((component as any).store.dispatch).toHaveBeenCalledWith(action2);
    });
  });


  describe('when initialized and is relationship show the list of buttons', () => {
    it('submit button should be disabled', () => {
      expect(debugElement.query(By.css('.submit')).nativeElement.getAttribute('aria-disabled')).toBe('true');
      expect(debugElement.query(By.css('.submit')).nativeElement.classList.contains('disabled')).toBeTrue();
    });
    it('discard button should be disabled', () => {
      expect(debugElement.query(By.css('.discard')).nativeElement.getAttribute('aria-disabled')).toBe('true');
      expect(debugElement.query(By.css('.discard')).nativeElement.classList.contains('disabled')).toBeTrue();
    });
  });

  describe('when changes happen', () => {
    beforeEach(() => {
      component.toAdd.push(searchResult1);
      component.toRemove.push(searchResult2);
      fixture.detectChanges();
    });
    it('submit button should be enabled', () => {
      expect(debugElement.query(By.css('.submit')).nativeElement?.disabled).toBeFalse();
    });
    it('discard button should be enabled', () => {
      expect(debugElement.query(By.css('.discard')).nativeElement?.disabled).toBeFalse();
    });
    it('should call submitEv when submit clicked', () => {
      const submitFunct = spyOn((component as any), 'submitEv');
      debugElement.query(By.css('.submit')).nativeElement.click();
      expect(submitFunct).toHaveBeenCalled();
    });
    it('should call discardEv when discard clicked', () => {
      const discardFunct = spyOn((component as any), 'discardEv');
      debugElement.query(By.css('.discard')).nativeElement.click();
      expect(discardFunct).toHaveBeenCalled();
    });
  });


  describe('when request starts and isPending changes', () => {

    beforeEach(() => {
      component.isPending = true;
      fixture.detectChanges();
    });

    it('there should show 1 spinner and disable all 3 buttons', () => {
      expect(debugElement.queryAll(By.css('.spinner-border')).length).toEqual(1);
      expect(debugElement.query(By.css('.submit')).nativeElement?.getAttribute('aria-disabled')).toBe('true');
      expect(debugElement.query(By.css('.submit')).nativeElement?.classList.contains('disabled')).toBeTrue();
      expect(debugElement.query(By.css('.discard')).nativeElement?.getAttribute('aria-disabled')).toBe('true');
      expect(debugElement.query(By.css('.discard')).nativeElement?.classList.contains('disabled')).toBeTrue();
      expect(debugElement.query(By.css('.btn-close')).nativeElement?.getAttribute('aria-disabled')).toBe('true');
      expect(debugElement.query(By.css('.btn-close')).nativeElement?.classList.contains('disabled')).toBeTrue();
    });

  });

});
