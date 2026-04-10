import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { Item } from '@dspace/core/shared/item.model';
import { Relationship } from '@dspace/core/shared/item-relationships/relationship.model';
import { ReorderableRelationship } from '@dspace/core/shared/item-relationships/reorderable-relationship';
import { ItemSearchResult } from '@dspace/core/shared/object-collection/item-search-result.model';
import { RelationshipOptions } from '@dspace/core/shared/relationship-options.model';
import { SubmissionServiceStub } from '@dspace/core/testing/submission-service.stub';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { SubmissionService } from '../../../../../submission/submission.service';
import { ListableObjectComponentLoaderComponent } from '../../../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { SelectableListService } from '../../../../object-list/selectable-list/selectable-list.service';
import { RemoveRelationshipAction } from '../relation-lookup-modal/relationship.actions';
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
      updatePlace: () => of({}),
    } as any;

    relationship = Object.assign(new Relationship(), { leftItem: leftItemRD$, rightItem: rightItemRD$ });
    submissionId = '1234';
    reoRel = new ReorderableRelationship(relationship, true);
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
