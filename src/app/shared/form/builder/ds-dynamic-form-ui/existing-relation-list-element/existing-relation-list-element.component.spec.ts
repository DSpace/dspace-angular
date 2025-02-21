import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { ItemSearchResult } from '@dspace/core';
import { RelationshipOptions } from '@dspace/core';
import { Item } from '@dspace/core';
import { Relationship } from '@dspace/core';
import { ReorderableRelationship } from '@dspace/core';
import { RemoveRelationshipAction } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { SubmissionServiceStub } from '@dspace/core';
import { SubmissionService } from '../../../../../../../modules/core/src/lib/core/submission/submission.service';
import { ListableObjectComponentLoaderComponent } from '../../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SelectableListService } from '../../../../../../../modules/core/src/lib/core/states/selectable-list/selectable-list.service';
import { ExistingRelationListElementComponent } from './existing-relation-list-element.component';

describe('ExistingRelationListElementComponent', () => {
  let component: ExistingRelationListElementComponent;
  let fixture: ComponentFixture<ExistingRelationListElementComponent>;
  let selectionService;
  let store;
  let listID;
  let submissionItem;
  let relationship;
  let reoRel;
  let metadataFields;
  let relationshipOptions;
  let uuid1;
  let uuid2;
  let relatedItem;
  let leftItemRD$;
  let rightItemRD$;
  let relatedSearchResult;
  let submissionId;
  let relationshipService;

  function init() {
    uuid1 = '91ce578d-2e63-4093-8c73-3faafd716000';
    uuid2 = '0e9dba1c-e1c3-4e05-a539-446f08ef57a7';
    selectionService = jasmine.createSpyObj('selectionService', ['deselectSingle']);
    store = jasmine.createSpyObj('store', ['dispatch']);
    listID = '1234-listID';
    submissionItem = Object.assign(new Item(), { uuid: uuid1 });
    metadataFields = ['dc.contributor.author'];
    relationshipOptions = Object.assign(new RelationshipOptions(), {
      relationshipType: 'isPublicationOfAuthor',
      filter: 'test.filter',
      searchConfiguration: 'personConfiguration',
      nameVariants: true,
    });
    relatedItem = Object.assign(new Item(), { uuid: uuid2 });
    leftItemRD$ = createSuccessfulRemoteDataObject$(relatedItem);
    rightItemRD$ = createSuccessfulRemoteDataObject$(submissionItem);
    relatedSearchResult = Object.assign(new ItemSearchResult(), { indexableObject: relatedItem });
    relationshipService = {
      updatePlace: () => observableOf({}),
    } as any;

    relationship = Object.assign(new Relationship(), { leftItem: leftItemRD$, rightItem: rightItemRD$ });
    submissionId = '1234';
    reoRel = new ReorderableRelationship(relationship, true, relationshipService, {} as any, submissionId);
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ExistingRelationListElementComponent,
      ],
      providers: [
        { provide: SelectableListService, useValue: selectionService },
        { provide: Store, useValue: store },
        { provide: SubmissionService, useClass: SubmissionServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(ExistingRelationListElementComponent, {
        remove: { imports: [ListableObjectComponentLoaderComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingRelationListElementComponent);
    component = fixture.componentInstance;
    component.listId = listID;
    component.submissionItem = submissionItem;
    component.reoRel = reoRel;
    component.metadataFields = metadataFields;
    component.relationshipOptions = relationshipOptions;
    component.submissionId = submissionId;
    fixture.detectChanges();
    component.ngOnChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('removeSelection', () => {
    it('should deselect the object in the selectable list service', () => {
      component.removeSelection();
      expect(selectionService.deselectSingle).toHaveBeenCalledWith(listID, relatedSearchResult);
    });

    it('should dispatch a RemoveRelationshipAction', () => {
      component.removeSelection();
      const action = new RemoveRelationshipAction(submissionItem, relatedItem, relationshipOptions.relationshipType, submissionId);
      expect(store.dispatch).toHaveBeenCalledWith(action);
    });
  });
});
