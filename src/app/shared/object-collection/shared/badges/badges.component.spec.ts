import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { getMockThemeService } from '../../../mocks/theme-service.mock';
import { ThemeService } from '../../../theme-support/theme.service';
import { ThemedAccessStatusBadgeComponent } from './access-status-badge/themed-access-status-badge.component';
import { BadgesComponent } from './badges.component';
import { ThemedMyDSpaceStatusBadgeComponent } from './my-dspace-status-badge/themed-my-dspace-status-badge.component';
import { ThemedStatusBadgeComponent } from './status-badge/themed-status-badge.component';
import { ThemedTypeBadgeComponent } from './type-badge/themed-type-badge.component';

describe('BadgesComponent', () => {
  let component: BadgesComponent;
  let fixture: ComponentFixture<BadgesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgesComponent],
      providers: [{ provide: ThemeService, useValue: getMockThemeService() }],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(BadgesComponent, { remove: { imports: [ThemedStatusBadgeComponent, ThemedMyDSpaceStatusBadgeComponent, ThemedTypeBadgeComponent, ThemedAccessStatusBadgeComponent] } }).compileComponents();
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
