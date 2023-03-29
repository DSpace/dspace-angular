import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { VocabularyExternalSourceComponent } from './vocabulary-external-source.component';
import { ExternalSourceDataService } from '../../core/data/external-source-data.service';
import { SubmissionObjectDataService } from '../../core/submission/submission-object-data.service';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationsServiceStub } from '../testing/notifications-service.stub';
import { ItemDataService } from '../../core/data/item-data.service';
import { TranslateLoaderMock } from '../mocks/translate-loader.mock';
import { WorkflowItem } from '../../core/submission/models/workflowitem.model';
import { Item } from '../../core/shared/item.model';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../remote-data.utils';
import { ExternalSourceEntry } from '../../core/shared/external-source-entry.model';
import {
  CreateItemParentSelectorComponent
} from '../dso-selector/modal-wrappers/create-item-parent-selector/create-item-parent-selector.component';
import { Collection } from '../../core/shared/collection.model';
import { Metadata } from '../../core/shared/metadata.utils';

describe('VocabularyExternalSourceComponent', () => {
  let component: VocabularyExternalSourceComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<VocabularyExternalSourceComponent>;
  let scheduler: TestScheduler;

  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const externalSourceService = jasmine.createSpyObj('ExternalSourceDataService', {
    getExternalSourceEntryById: jasmine.createSpy('getExternalSourceEntryById')
  });
  const submissionObjectDataService = jasmine.createSpyObj('SubmissionObjectDataService', {
    findById: jasmine.createSpy('findById')
  });
  const itemDataService = jasmine.createSpyObj('ItemDataService', {
    importExternalSourceEntry: jasmine.createSpy('importExternalSourceEntry')
  });
  const mockItem: Item = Object.assign(new Item(), {
    id: 'mockitem',
    uuid: 'mockitem',
    metadata: {
      'dc.contributor.author': [
        {
          language: 'en_US',
          value: 'Smith, Donald'
        }
      ],
      'dc.date.issued': [
        {
          language: null,
          value: '2015-06-26'
        }
      ],
      'dc.title': [
        {
          language: 'en_US',
          value: 'This is just another title'
        }
      ],
      'dc.type': [
        {
          language: null,
          value: 'Article'
        }
      ]
    }
  });
  const submissionObject = Object.assign(new WorkflowItem(), {
    item: createSuccessfulRemoteDataObject$(mockItem)
  });
  const externalEntry = Object.assign(new ExternalSourceEntry(), {
    id: '0001-0001-0001-0001',
    display: 'Smith, Donald',
    value: 'Smith, Donald',
    metadata: {
      'dc.title': [
        {
          value: 'Smith, Donald'
        }
      ]
    },
    _links: { self: { href: 'http://test-rest.com/server/api/integration/externalSources/author/entryValues/0001-0001-0001-0001' } }
  });
  const ngbModal = jasmine.createSpyObj('modal', ['open']);
  const emittedEvent: Collection = Object.assign(new Collection(), {
      id: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
      uuid: 'ce64f48e-2c9b-411a-ac36-ee429c0e6a88',
      name: 'Collection 1',
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
        { provide: NgbModal, useValue: ngbModal },
        { provide: ExternalSourceDataService, useValue: externalSourceService },
        { provide: ItemDataService, useValue: itemDataService },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: SubmissionObjectDataService, useValue: submissionObjectDataService },
        TranslateService,
        VocabularyExternalSourceComponent
      ],
      declarations: [ VocabularyExternalSourceComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    submissionObjectDataService.findById.and.returnValue(createSuccessfulRemoteDataObject$(submissionObject));
  });

  afterEach(() => {
    fixture.destroy();
    component = null;
    componentAsAny = null;
  });

  describe('when external source is retrieved successfully', () => {

    beforeEach(() => {
      externalSourceService.getExternalSourceEntryById.and.returnValue(createSuccessfulRemoteDataObject$(externalEntry));
      fixture = TestBed.createComponent(VocabularyExternalSourceComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.metadataPlace = '0';
      fixture.detectChanges();
    });

    it('should create', (done) => {
      expect(component).toBeTruthy();
      done();
    });

    it('should init component properly', () => {
      const expectedMedata = Metadata.toViewModelList(externalEntry.metadata);
      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();

      expect(component).toBeTruthy();
      expect(componentAsAny.externalSourceEntry).toEqual(externalEntry);
      expect(componentAsAny.metadataList).toEqual(expectedMedata);
    });

    it('should import', (done) => {
      spyOn(componentAsAny, 'createEntityFromExternalSource');
      componentAsAny.externalSourceEntry = externalEntry;
      ngbModal.open.and.returnValue({
        componentInstance: { select: observableOf(emittedEvent) },
        close: () => {
          return;
        }
      });
      component.import();

      expect(componentAsAny.modalService.open).toHaveBeenCalledWith(CreateItemParentSelectorComponent, { size: 'lg' });
      expect(componentAsAny.modalRef.componentInstance).toBeDefined();
      expect(componentAsAny.createEntityFromExternalSource).toHaveBeenCalledWith(externalEntry, emittedEvent.uuid);
      done();
    });

    it('should show notification when import has succeeded ', () => {
      spyOn(component, 'closeModal');
      itemDataService.importExternalSourceEntry.and.returnValue(createSuccessfulRemoteDataObject$(new Item()));

      scheduler.schedule(() => componentAsAny.createEntityFromExternalSource(externalEntry, emittedEvent.uuid));
      scheduler.flush();

      expect(componentAsAny.notificationService.success).toHaveBeenCalled();
    });

    it('should show notification when import has not succeeded ', () => {
      spyOn(component, 'closeModal');
      itemDataService.importExternalSourceEntry.and.returnValue(createFailedRemoteDataObject$('fail'));

      scheduler.schedule(() => componentAsAny.createEntityFromExternalSource(externalEntry, emittedEvent.uuid));
      scheduler.flush();

      expect(componentAsAny.notificationService.error).toHaveBeenCalled();
    });
  });

  describe('when external source is retrieved unsuccessfully', () => {

    beforeEach(() => {
      externalSourceService.getExternalSourceEntryById.and.returnValue(createFailedRemoteDataObject$('fail'));
      fixture = TestBed.createComponent(VocabularyExternalSourceComponent);
      component = fixture.componentInstance;
      componentAsAny = fixture.componentInstance;
      component.metadataPlace = '0';
      fixture.detectChanges();
    });

    it('should init component properly', () => {

      scheduler.schedule(() => component.ngOnInit());
      scheduler.flush();

      expect(component).toBeTruthy();
      expect(componentAsAny.externalSourceEntry).not.toBeDefined();
      expect(componentAsAny.metadataList).toEqual([]);
    });

  });
});
