import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';

import { CurationFormComponent } from '../../curation-form/curation-form.component';
import { AdminCurationTasksComponent } from './admin-curation-tasks.component';

describe('AdminCurationTasksComponent', () => {
  let comp: AdminCurationTasksComponent;
  let fixture: ComponentFixture<AdminCurationTasksComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), AdminCurationTasksComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideComponent(AdminCurationTasksComponent, {
        remove: {
          imports: [CurationFormComponent],
        },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCurationTasksComponent);
    comp = fixture.componentInstance;
  });
  describe('init', () => {
    it('should initialise the comp', () => {
      expect(comp).toBeDefined();
      expect(fixture.debugElement.nativeElement.innerHTML).toContain('ds-curation-form');
    });
  });
});
