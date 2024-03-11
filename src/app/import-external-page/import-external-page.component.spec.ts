import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { getMockThemeService } from '../shared/mocks/theme-service.mock';
import { ThemeService } from '../shared/theme-support/theme.service';
import { ImportExternalPageComponent } from './import-external-page.component';

describe('ImportExternalPageComponent', () => {
  let component: ImportExternalPageComponent;
  let fixture: ComponentFixture<ImportExternalPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExternalPageComponent ],
      providers:[
        { provide: ThemeService, useValue: getMockThemeService() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
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
