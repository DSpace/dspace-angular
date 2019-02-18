import { ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, SimpleChange } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { of as observableOf } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';

import { SubmissionServiceStub } from '../../../shared/testing/submission-service-stub';
import { mockSubmissionId, mockSubmissionRestResponse } from '../../../shared/mocks/mock-submission';
import { SubmissionService } from '../../submission.service';
import { SubmissionFormCollectionComponent } from './submission-form-collection.component';
import { CommunityDataService } from '../../../core/data/community-data.service';
import { SubmissionJsonPatchOperationsService } from '../../../core/submission/submission-json-patch-operations.service';
import { SubmissionJsonPatchOperationsServiceStub } from '../../../shared/testing/submission-json-patch-operations-service-stub';
import { JsonPatchOperationsBuilder } from '../../../core/json-patch/builder/json-patch-operations-builder';
import { JsonPatchOperationPathCombiner } from '../../../core/json-patch/builder/json-patch-operation-path-combiner';
import { Community } from '../../../core/shared/community.model';
import { RemoteData } from '../../../core/data/remote-data';
import { PaginatedList } from '../../../core/data/paginated-list';
import { PageInfo } from '../../../core/shared/page-info.model';
import { Collection } from '../../../core/shared/collection.model';
import { createTestComponent } from '../../../shared/testing/utils';
import { cold } from 'jasmine-marbles';

const subcommunities = [Object.assign(new Community(), {
  name: 'SubCommunity 1',
  id: '123456789-1',
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'SubCommunity 1'
    }]
}),
  Object.assign(new Community(), {
    name: 'SubCommunity 1',
    id: '123456789s-1',
    metadata: [
      {
        key: 'dc.title',
        language: 'en_US',
        value: 'SubCommunity 1'
      }]
  })
];

const mockCommunity1Collection1 = Object.assign(new Collection(), {
  name: 'Community 1-Collection 1',
  id: '1234567890-1',
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Community 1-Collection 1'
    }]
});

const mockCommunity1Collection2 = Object.assign(new Collection(), {
  name: 'Community 1-Collection 2',
  id: '1234567890-2',
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Community 1-Collection 2'
    }]
});

const mockCommunity2Collection1 = Object.assign(new Collection(), {
  name: 'Community 2-Collection 1',
  id: '1234567890-3',
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Community 2-Collection 1'
    }]
});

const mockCommunity2Collection2 = Object.assign(new Collection(), {
  name: 'Community 2-Collection 2',
  id: '1234567890-4',
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Community 2-Collection 2'
    }]
});

const mockCommunity = Object.assign(new Community(), {
  name: 'Community 1',
  id: '123456789-1',
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Community 1'
    }],
  collections: observableOf(new RemoteData(true, true, true,
    undefined, new PaginatedList(new PageInfo(), [mockCommunity1Collection1, mockCommunity1Collection2]))),
  subcommunities: observableOf(new RemoteData(true, true, true,
    undefined, new PaginatedList(new PageInfo(), subcommunities))),
});

const mockCommunity2 = Object.assign(new Community(), {
  name: 'Community 2',
  id: '123456789-2',
  metadata: [
    {
      key: 'dc.title',
      language: 'en_US',
      value: 'Community 2'
    }],
  collections: observableOf(new RemoteData(true, true, true,
    undefined, new PaginatedList(new PageInfo(), [mockCommunity2Collection1, mockCommunity2Collection2]))),
  subcommunities: observableOf(new RemoteData(true, true, true,
    undefined, new PaginatedList(new PageInfo(), []))),
});

const mockCommunityList = observableOf(new RemoteData(true, true, true,
  undefined, new PaginatedList(new PageInfo(), [mockCommunity, mockCommunity2])));

const mockCollectionList = [
  {
    communities: [
      {
        id: '123456789-1',
        name: 'Community 1'
      }
    ],
    collection: {
      id: '1234567890-1',
      name: 'Community 1-Collection 1'
    }
  },
  {
    communities: [
      {
        id: '123456789-1',
        name: 'Community 1'
      }
    ],
    collection: {
      id: '1234567890-2',
      name: 'Community 1-Collection 2'
    }
  },
  {
    communities: [
      {
        id: '123456789-2',
        name: 'Community 2'
      }
    ],
    collection: {
      id: '1234567890-3',
      name: 'Community 2-Collection 1'
    }
  },
  {
    communities: [
      {
        id: '123456789-2',
        name: 'Community 2'
      }
    ],
    collection: {
      id: '1234567890-4',
      name: 'Community 2-Collection 2'
    }
  }
];

describe('SubmissionFormCollectionComponent Component', () => {

  let comp: SubmissionFormCollectionComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionFormCollectionComponent>;
  let submissionServiceStub: SubmissionServiceStub;
  let jsonPatchOpServiceStub: SubmissionJsonPatchOperationsServiceStub;

  const submissionId = mockSubmissionId;
  const collectionId = '1234567890-1';
  const definition = 'traditional';
  const submissionRestResponse = mockSubmissionRestResponse;
  const searchedCollection = 'Community 2-Collection 2';

  const communityDataService: any = jasmine.createSpyObj('communityDataService', {
    findAll: jasmine.createSpy('findAll')
  });
  const store: any = jasmine.createSpyObj('store', {
    dispatch: jasmine.createSpy('dispatch'),
    select: jasmine.createSpy('select')
  });
  const jsonPatchOpBuilder: any = jasmine.createSpyObj('jsonPatchOpBuilder', {
    replace: jasmine.createSpy('replace')
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgbModule.forRoot(),
        TranslateModule.forRoot()
      ],
      declarations: [
        SubmissionFormCollectionComponent,
        TestComponent
      ],
      providers: [
        { provide: SubmissionJsonPatchOperationsService, useClass: SubmissionJsonPatchOperationsServiceStub },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
        { provide: CommunityDataService, useValue: communityDataService },
        { provide: JsonPatchOperationsBuilder, useValue: jsonPatchOpBuilder },
        { provide: Store, useValue: store },
        ChangeDetectorRef,
        SubmissionFormCollectionComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-submission-form-collection [currentCollectionId]="collectionId"
                                       [currentDefinition]="definitionId"
                                       [submissionId]="submissionId"
                                       (collectionChange)="onCollectionChange($event)">
        </ds-submission-form-collection>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionFormCollectionComponent', inject([SubmissionFormCollectionComponent], (app: SubmissionFormCollectionComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionFormCollectionComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
      submissionServiceStub = TestBed.get(SubmissionService);
      jsonPatchOpServiceStub = TestBed.get(SubmissionJsonPatchOperationsService);
      comp.currentCollectionId = collectionId;
      comp.currentDefinition = definition;
      comp.submissionId = submissionId;
    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      fixture = null;
      submissionServiceStub = null;
      jsonPatchOpServiceStub = null;
    });

    it('should init JsonPatchOperationPathCombiner', () => {
      const expected = new JsonPatchOperationPathCombiner('sections', 'collection');

      fixture.detectChanges();

      expect(compAsAny.pathCombiner).toEqual(expected);
    });

    it('should init collection list properly', () => {
      communityDataService.findAll.and.returnValue(mockCommunityList);

      comp.ngOnChanges({
        currentCollectionId: new SimpleChange(null, collectionId, true)
      });

      expect(comp.searchListCollection$).toBeObservable(cold('(ab)', {
        a: [],
        b: mockCollectionList
      }));

      expect(comp.selectedCollectionName$).toBeObservable(cold('(ab|)', {
        a: '',
        b: 'Community 1-Collection 1'
      }));
    });

    it('should show only the searched collection', () => {
      comp.searchListCollection$ = observableOf(mockCollectionList);
      fixture.detectChanges();

      comp.searchField.setValue(searchedCollection);
      fixture.detectChanges();

      comp.searchListCollection$.pipe(
        filter(() => !comp.disabled$.getValue())
      ).subscribe((list) => {
        expect(list).toEqual([mockCollectionList[3]]);
      });

    });

    it('should emit collectionChange event when selecting a new collection', () => {
      spyOn(comp.searchField, 'reset').and.callThrough();
      spyOn(comp.collectionChange, 'emit').and.callThrough();
      jsonPatchOpServiceStub.jsonPatchByResourceID.and.returnValue(observableOf(submissionRestResponse));
      comp.ngOnInit();
      comp.onSelect(mockCollectionList[1]);
      fixture.detectChanges();

      expect(comp.searchField.reset).toHaveBeenCalled();
      expect(comp.collectionChange.emit).toHaveBeenCalledWith(submissionRestResponse[0]);
      expect(submissionServiceStub.changeSubmissionCollection).toHaveBeenCalled();
      expect(comp.selectedCollectionId).toBe(mockCollectionList[1].collection.id);
      expect(comp.selectedCollectionName$).toBeObservable(cold('(a|)', {
        a: mockCollectionList[1].collection.name
      }));

    });

    it('should reset searchField when dropdown menu has been closed', () => {
      spyOn(comp.searchField, 'reset').and.callThrough();
      comp.toggled(false);

      expect(comp.searchField.reset).toHaveBeenCalled();
    });

    describe('', () => {
      let dropdowBtn: DebugElement;
      let dropdownMenu: DebugElement;

      beforeEach(() => {

        comp.searchListCollection$ = observableOf(mockCollectionList);
        fixture.detectChanges();
        dropdowBtn = fixture.debugElement.query(By.css('#collectionControlsMenuButton'));
        dropdownMenu = fixture.debugElement.query(By.css('#collectionControlsDropdownMenu'));
      });

      it('should have dropdown menu closed', () => {

        expect(dropdowBtn).not.toBeUndefined();
        expect(dropdownMenu.nativeElement.classList).not.toContain('show');

      });

      it('should display dropdown menu when click on dropdown button', fakeAsync(() => {

        spyOn(comp, 'onClose');
        dropdowBtn.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          expect(comp.onClose).toHaveBeenCalled();
          expect(dropdownMenu.nativeElement.classList).toContain('show');
          expect(dropdownMenu.queryAll(By.css('.collection-item')).length).toBe(4);
        });
      }));

      it('should trigger onSelect method when select a new collection from dropdown menu', fakeAsync(() => {

        spyOn(comp, 'onSelect');
        dropdowBtn.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        const secondLink: DebugElement = dropdownMenu.query(By.css('.collection-item:nth-child(2)'));
        secondLink.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        fixture.whenStable().then(() => {

          expect(comp.onSelect).toHaveBeenCalled();
        });
      }));

      it('should update searchField on input type', fakeAsync(() => {

        dropdowBtn.triggerEventHandler('click', null);
        tick();
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          const input = fixture.debugElement.query(By.css('input.form-control'));
          const el = input.nativeElement;

          expect(el.value).toBe('');

          el.value = searchedCollection;
          el.dispatchEvent(new Event('input'));

          fixture.detectChanges();

          expect(fixture.componentInstance.searchField.value).toEqual(searchedCollection);
        });
      }));

    });

  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

  collectionId = '1234567890-1';
  definitionId = 'traditional';
  submissionId = mockSubmissionId;

  onCollectionChange = () => { return; }

}
