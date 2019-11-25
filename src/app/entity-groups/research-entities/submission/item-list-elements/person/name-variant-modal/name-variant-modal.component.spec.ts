import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameVariantModalComponent } from './name-variant-modal.component';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

describe('NameVariantModalComponent', () => {
  let component: NameVariantModalComponent;
  let fixture: ComponentFixture<NameVariantModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NameVariantModalComponent],
      imports: [NgbModule.forRoot(), TranslateModule.forRoot()],
      providers: [NgbActiveModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameVariantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
