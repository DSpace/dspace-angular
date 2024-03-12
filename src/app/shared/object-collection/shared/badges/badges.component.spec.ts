import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { ThemeService } from '../../../theme-support/theme.service';
import { BadgesComponent } from './badges.component';

describe('BadgesComponent', () => {
  let component: BadgesComponent;
  let fixture: ComponentFixture<BadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgesComponent],
      providers: [{ provide: ThemeService, useValue: getMockThemeService() }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
