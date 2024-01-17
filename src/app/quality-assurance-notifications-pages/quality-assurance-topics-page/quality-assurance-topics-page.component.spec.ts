import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QualityAssuranceTopicsPageComponent } from './quality-assurance-topics-page.component';

describe('QualityAssuranceTopicsPageComponent', () => {
  let component: QualityAssuranceTopicsPageComponent;
  let fixture: ComponentFixture<QualityAssuranceTopicsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityAssuranceTopicsPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityAssuranceTopicsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create QualityAssuranceTopicsPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
