import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ContextHelpToggleComponent } from './context-help-toggle.component';
import { TranslateModule } from '@ngx-translate/core';
import { ContextHelpService } from '../../shared/context-help.service';
import { of as observableOf } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ContextHelpToggleComponent', () => {
  let component: ContextHelpToggleComponent;
  let fixture: ComponentFixture<ContextHelpToggleComponent>;
  let contextHelpService;

  beforeEach(async () => {
    contextHelpService = jasmine.createSpyObj('contextHelpService', [
      'contextHelpEmpty$', 'toggleIcons'
    ]);
    contextHelpService.contextHelpEmpty$.and.returnValue(observableOf(true));
    await TestBed.configureTestingModule({
      declarations: [ ContextHelpToggleComponent ],
      providers: [
        { provide: ContextHelpService, useValue: contextHelpService },
      ],
      imports: [ TranslateModule.forRoot() ]
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
    it('clicking the button does not toggle context help icon visibility', fakeAsync(() => {
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.debugElement.query(By.css('a')).nativeElement.click();
        tick();
        expect(contextHelpService.toggleIcons).toHaveBeenCalledTimes(0);
      });
    }));
  });

  describe('if there are elements on the page with a tooltip', () => {
    beforeEach(() => {
      contextHelpService.contextHelpEmpty$.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('clicking the button should toggle context help icon visibility', fakeAsync(() => {
      fixture.whenStable().then(() => {
        fixture.debugElement.query(By.css('a')).nativeElement.click();
        tick();
        expect(contextHelpService.toggleIcons).toHaveBeenCalled();
      });
    }));
  });

});
