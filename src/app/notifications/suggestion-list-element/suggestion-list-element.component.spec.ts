import { SuggestionListElementComponent } from './suggestion-list-element.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { mockSuggestionPublicationOne } from '../../shared/mocks/publication-claim.mock';
import { Item } from '../../core/shared/item.model';


describe('SuggestionListElementComponent', () => {
  let component: SuggestionListElementComponent;
  let fixture: ComponentFixture<SuggestionListElementComponent>;
  let scheduler: TestScheduler;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [SuggestionListElementComponent],
      providers: [
        NgbModal
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then();
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
        metadata: mockSuggestionPublicationOne.metadata
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
      component.changeSelected({target: { checked: true}});
      expect(component.selected.next).toHaveBeenCalledWith(true);
    });

    it('should emit for deletion', () => {
      spyOn(component.ignoreSuggestionClicked, 'emit');
      component.onIgnoreSuggestion('1234');
      expect(component.ignoreSuggestionClicked.emit).toHaveBeenCalledWith('1234');
    });

    it('should emit for approve and import', () => {
      const event = {collectionId:'1234', suggestion: mockSuggestionPublicationOne};
      spyOn(component.approveAndImport, 'emit');
      component.onApproveAndImport(event);
      expect(component.approveAndImport.emit).toHaveBeenCalledWith(event);
    });
  });
});
