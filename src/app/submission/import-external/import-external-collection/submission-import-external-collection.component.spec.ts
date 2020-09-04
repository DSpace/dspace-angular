import { Component, NO_ERRORS_SCHEMA, EventEmitter } from '@angular/core';
import { async, TestBed, ComponentFixture, inject } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { createTestComponent } from '../../../shared/testing/utils.test';
import { SubmissionImportExternalCollectionComponent } from './submission-import-external-collection.component';
import { CollectionListEntry } from '../../../shared/collection-dropdown/collection-dropdown.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('SubmissionImportExternalCollectionComponent test suite', () => {
  let comp: SubmissionImportExternalCollectionComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<SubmissionImportExternalCollectionComponent>;

  beforeEach(async (() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      declarations: [
        SubmissionImportExternalCollectionComponent,
        TestComponent,
      ],
      providers: [
        NgbActiveModal,
        SubmissionImportExternalCollectionComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents().then();
  }));

  // First test to check the correct component creation
  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-submission-import-external-collection></ds-submission-import-external-collection>`;
      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create SubmissionImportExternalCollectionComponent', inject([SubmissionImportExternalCollectionComponent], (app: SubmissionImportExternalCollectionComponent) => {
      expect(app).toBeDefined();
    }));
  });

  describe('', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(SubmissionImportExternalCollectionComponent);
      comp = fixture.componentInstance;
      compAsAny = comp;
    });

    afterEach(() => {
      fixture.destroy();
      comp = null;
      compAsAny = null;
    });

    it('The variable \'selectedEvent\' should be assigned', () => {
      const event = new EventEmitter<CollectionListEntry>();
      comp.selectObject(event);

      expect(comp.selectedEvent).toEqual(event);
    });

    it('The variable \'selectedEvent\' should be assigned', () => {
      spyOn(compAsAny.activeModal, 'dismiss');
      comp.closeCollectionModal();

      expect(compAsAny.activeModal.dismiss).toHaveBeenCalled();
    });
  });
});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

}
