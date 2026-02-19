import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { AdminWorkflowPageComponent } from './admin-workflow-page.component';
import { ThemedSearchComponent } from '../../shared/search/themed-search.component';

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
            ThemedSearchComponent,
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
