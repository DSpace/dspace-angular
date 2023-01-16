import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextHelpToggleComponent } from './context-help-toggle.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ContextHelpService } from '../../shared/context-help.service';
import { of as observableOf, BehaviorSubject } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('ContextHelpToggleComponent', () => {
  let component: ContextHelpToggleComponent;
  let fixture: ComponentFixture<ContextHelpToggleComponent>;
  let contextHelpService;
  const contextHelpEmpty$ = new BehaviorSubject(true);

  beforeEach(async () => {
    contextHelpService = jasmine.createSpyObj('contextHelpService',
      ['toggleIcons', 'contextHelpEmpty$']);
    contextHelpService.contextHelpEmpty$.and.returnValue(contextHelpEmpty$);
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('if there are elements on the page with a tooltip', () => {
    beforeEach(() => {
      contextHelpEmpty$.next(false);
      fixture.detectChanges();
    });

    it('clicking the button should toggle context help icon visibility', () => {
      fixture.whenStable().then((done) => {
        fixture.debugElement.query(By.css('a')).nativeElement.click();
        expect(contextHelpService.toggleIcons).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('if there are no elements on the page with a tooltip', () => {
    it('clicking the button does not toggle context help icon visibility', () => {
      fixture.whenStable().then((done) => {
        fixture.debugElement.query(By.css('a')).nativeElement.click();
        expect(contextHelpService.toggleIcons).toHaveBeenCalledTimes(0);
        done();
      });
    });
  });
});
