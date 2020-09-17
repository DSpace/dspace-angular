import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ImportExternalPageComponent } from './import-external-page.component';

describe('ImportExternalPageComponent', () => {
  let component: ImportExternalPageComponent;
  let fixture: ComponentFixture<ImportExternalPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExternalPageComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExternalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ImportExternalPageComponent', () => {
    expect(component).toBeTruthy();
  });
});
