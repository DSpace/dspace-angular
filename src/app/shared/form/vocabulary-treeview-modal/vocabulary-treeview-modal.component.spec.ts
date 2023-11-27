import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { VocabularyTreeviewModalComponent } from './vocabulary-treeview-modal.component';
import { VocabularyOptions } from '../../../core/submission/vocabularies/models/vocabulary-options.model';

describe('VocabularyTreeviewModalComponent', () => {
  let component: VocabularyTreeviewModalComponent;
  let fixture: ComponentFixture<VocabularyTreeviewModalComponent>;

  const modalStub = jasmine.createSpyObj('modalStub', ['close']);
  const vocabularyOptions = new VocabularyOptions('vocabularyTest', null, null, false);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ TranslateModule.forRoot() ],
      declarations: [ VocabularyTreeviewModalComponent ],
      providers: [
        { provide: NgbActiveModal, useValue: modalStub },
      ],
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
