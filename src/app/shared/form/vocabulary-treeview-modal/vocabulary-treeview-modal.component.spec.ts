import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';
import { VocabularyTreeviewComponent } from '../vocabulary-treeview/vocabulary-treeview.component';
import { VocabularyTreeviewModalComponent } from './vocabulary-treeview-modal.component';

describe('VocabularyTreeviewModalComponent', () => {
  let component: VocabularyTreeviewModalComponent;
  let fixture: ComponentFixture<VocabularyTreeviewModalComponent>;

  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const vocabularyOptions = new VocabularyOptions('vocabularyTest', false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), VocabularyTreeviewModalComponent],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
      ],
    })
      .overrideComponent(VocabularyTreeviewModalComponent, {
        remove: {
          imports: [VocabularyTreeviewComponent],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyTreeviewModalComponent);
    component = fixture.componentInstance;
    component.vocabularyOptions = vocabularyOptions;
    spyOn(component as any, 'setDescription').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init descrption message', () => {
    expect((component as any).setDescription).toHaveBeenCalled();
  });
});
