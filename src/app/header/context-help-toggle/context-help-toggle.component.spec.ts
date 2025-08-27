import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ContextHelpService } from '../../shared/context-help.service';
import { ContextHelpToggleComponent } from './context-help-toggle.component';

describe('ContextHelpToggleComponent', () => {
  let component: ContextHelpToggleComponent;
  let fixture: ComponentFixture<ContextHelpToggleComponent>;
  let contextHelpService;

  beforeEach(async () => {
    contextHelpService = jasmine.createSpyObj('contextHelpService', [
      'tooltipCount$', 'toggleIcons',
    ]);
    contextHelpService.tooltipCount$.and.returnValue(of(0));
    await TestBed.configureTestingModule({
      providers: [
        { provide: ContextHelpService, useValue: contextHelpService },
      ],
      imports: [TranslateModule.forRoot(), ContextHelpToggleComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextHelpToggleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('if there are no elements on the page with a tooltip', () => {
    it('the toggle should not be visible', fakeAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        expect(fixture.debugElement.query(By.css('div'))).toBeNull();
      });
    }));
  });

  describe('if there are elements on the page with a tooltip', () => {
    beforeEach(() => {
      contextHelpService.tooltipCount$.and.returnValue(of(1));
      fixture.detectChanges();
    });

    it('clicking the button should toggle context help icon visibility', fakeAsync(() => {
      fixture.debugElement.query(By.css('a')).nativeElement.click();
      tick();
      expect(contextHelpService.toggleIcons).toHaveBeenCalled();
    }));
  });

});
