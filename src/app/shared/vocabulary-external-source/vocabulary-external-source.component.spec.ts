import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VocabularyExternalSourceComponent } from './vocabulary-external-source.component';

describe('VocabularyExternalSourceComponent', () => {
  let component: VocabularyExternalSourceComponent;
  let fixture: ComponentFixture<VocabularyExternalSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VocabularyExternalSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VocabularyExternalSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
