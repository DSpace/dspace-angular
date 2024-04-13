import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { ThemedConfigurationSearchPageComponent } from '../../search-page/themed-configuration-search-page.component';
import { AdminWorkflowPageComponent } from './admin-workflow-page.component';

describe('AdminSearchPageComponent', () => {
  let component: AdminWorkflowPageComponent;
  let fixture: ComponentFixture<AdminWorkflowPageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AdminWorkflowPageComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(AdminWorkflowPageComponent, {
        remove: {
          imports: [
            ThemedConfigurationSearchPageComponent,
          ],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminWorkflowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
