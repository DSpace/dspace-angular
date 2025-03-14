import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

import { Item } from '../../../core/shared/item.model';
import { mockSuggestionPublicationOne } from '../../../shared/mocks/publication-claim.mock';
import { ItemSearchResultListElementComponent } from '../../../shared/object-list/search-result-list-element/item-search-result/item-types/item/item-search-result-list-element.component';
import { SuggestionActionsComponent } from '../actions/suggestion-actions.component';
import { SuggestionEvidencesComponent } from './suggestion-evidences/suggestion-evidences.component';
import { SuggestionListElementComponent } from './suggestion-list-element.component';

describe('SuggestionListElementComponent', () => {
  let component: SuggestionListElementComponent;
  let fixture: ComponentFixture<SuggestionListElementComponent>;
  let scheduler: TestScheduler;


  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        SuggestionListElementComponent,
      ],
      providers: [
        NgbModal,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(SuggestionListElementComponent, {
        remove: {
          imports: [
            ItemSearchResultListElementComponent,
            SuggestionActionsComponent,
            SuggestionEvidencesComponent,
          ],
        },
      })
      .compileComponents().then();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestionListElementComponent);
    component = fixture.componentInstance;
    scheduler = getTestScheduler();

    component.object = mockSuggestionPublicationOne;
  });

  describe('SuggestionListElementComponent test', () => {

    it('should create', () => {
      scheduler.schedule(() => fixture.detectChanges());
      scheduler.flush();
      const expectedIndexableObject = Object.assign(new Item(), {
        id: mockSuggestionPublicationOne.id,
        metadata: mockSuggestionPublicationOne.metadata,
      });
      expect(component).toBeTruthy();
      expect(component.listableObject.hitHighlights).toEqual({});
      expect(component.listableObject.indexableObject).toEqual(expectedIndexableObject);
    });

    it('should check if has evidence', () => {
      expect(component.hasEvidences()).toBeTruthy();
    });

    it('should set seeEvidences', () => {
      component.onSeeEvidences(true);
      expect(component.seeEvidence).toBeTruthy();
    });

    it('should emit selection', () => {
      spyOn(component.selected, 'next');
      component.changeSelected({ target: { checked: true } });
      expect(component.selected.next).toHaveBeenCalledWith(true);
    });

    it('should emit for deletion', () => {
      spyOn(component.ignoreSuggestionClicked, 'emit');
      component.onIgnoreSuggestion('1234');
      expect(component.ignoreSuggestionClicked.emit).toHaveBeenCalledWith('1234');
    });

    it('should emit for approve and import', () => {
      const event = { collectionId:'1234', suggestion: mockSuggestionPublicationOne };
      spyOn(component.approveAndImport, 'emit');
      component.onApproveAndImport(event);
      expect(component.approveAndImport.emit).toHaveBeenCalledWith(event);
    });
  });
});
