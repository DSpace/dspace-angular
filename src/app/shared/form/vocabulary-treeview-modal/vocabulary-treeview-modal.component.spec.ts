import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyTreeviewModalComponent } from './vocabulary-treeview-modal.component';

describe('VocabularyTreeviewModalComponent', () => {
  let component: VocabularyTreeviewModalComponent;
  let fixture: ComponentFixture<VocabularyTreeviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VocabularyTreeviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyTreeviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
