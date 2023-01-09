import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { ContextHelpWrapperComponent } from './context-help-wrapper.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ContextHelpService } from '../context-help.service';
import { ContextHelp } from '../context-help.model';
import { Component, Input, ViewChild, DebugElement } from '@angular/core';
import { PlacementArray } from '@ng-bootstrap/ng-bootstrap/util/positioning';
import { PlacementDir } from './placement-dir.model';
import { By } from '@angular/platform-browser';

@Component({
  template: `
    <ng-template #div>template</ng-template>
    <ds-context-help-wrapper
      #chwrapper
      [templateRef]="div"
      [content]="content"
      [id]="id"
      [tooltipPlacement]="tooltipPlacement"
      [iconPlacement]="iconPlacement"
    >
    </ds-context-help-wrapper>
  `
})
class TemplateComponent {
  @Input() content: string;
  @Input() id: string;
  @Input() tooltipPlacement?: PlacementArray;
  @Input() iconPlacement?: PlacementDir;
}

const messages = {
  lorem: 'lorem ipsum dolor sit amet',
  linkTest: 'This is text, [this](https://dspace.lyrasis.org) is a link, and [so is this](https://google.com)'
};
const exampleContextHelp: ContextHelp = {
  id: 'test-tooltip',
  isTooltipVisible: false
};

describe('ContextHelpWrapperComponent', () => {
  let templateComponent: TemplateComponent;
  let wrapperComponent: ContextHelpWrapperComponent;
  let fixture: ComponentFixture<TemplateComponent>;
  let el: DebugElement;
  let translateService: any;
  let contextHelpService: any;
  let getContextHelp$: BehaviorSubject<ContextHelp>;
  let shouldShowIcons$: BehaviorSubject<boolean>;

  function makeWrappedElement(): HTMLElement {
    let el: HTMLElement = document.createElement('div')
    el.innerHTML = 'example element';
    return el;
  }

  beforeEach(waitForAsync( () => {
    translateService = jasmine.createSpyObj('translateService', ['get']);
    contextHelpService = jasmine.createSpyObj('contextHelpService', [
      'shouldShowIcons$',
      'getContextHelp$',
      'add',
      'remove',
      'toggleIcons',
      'toggleTooltip',
      'showTooltip',
      'hideTooltip'
    ]);

    TestBed.configureTestingModule({
      imports: [ NgbTooltipModule ],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: ContextHelpService, useValue: contextHelpService },
      ],
      declarations: [ TemplateComponent, ContextHelpWrapperComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Initializing services.
    getContextHelp$ = new BehaviorSubject<ContextHelp>(exampleContextHelp);
    shouldShowIcons$ = new BehaviorSubject<boolean>(false);
    contextHelpService.getContextHelp$.and.returnValue(getContextHelp$);
    contextHelpService.shouldShowIcons$.and.returnValue(shouldShowIcons$);
    translateService.get.and.callFake((content) => observableOf(messages[content]));

    getContextHelp$.next(exampleContextHelp);
    shouldShowIcons$.next(false);

    // Initializing components.
    fixture = TestBed.createComponent(TemplateComponent);
    el = fixture.debugElement;
    templateComponent = fixture.componentInstance;
    templateComponent.content = 'lorem'
    templateComponent.id = 'test-tooltip'
    templateComponent.tooltipPlacement = ['bottom'];
    templateComponent.iconPlacement = 'left';
    wrapperComponent = el.query(By.css('ds-context-help-wrapper')).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(templateComponent).toBeDefined();
    expect(wrapperComponent).toBeDefined();
  });

  it('should not show the context help icon while icon visibility is not turned on', (done) => {
    fixture.whenStable().then(() => {
      let wrapper = el.query(By.css('ds-context-help-wrapper')).nativeElement;
      expect(wrapper.children.length).toBe(0);
      done();
    });
  });

  describe('when icon visibility is turned on', () => {
    beforeEach(() => {
      shouldShowIcons$.next(true);
      fixture.detectChanges();
      spyOn(wrapperComponent.tooltip, 'open').and.callThrough();
      spyOn(wrapperComponent.tooltip, 'close').and.callThrough();
    });

    it('should show the context help button', (done) => {
      fixture.whenStable().then(() => {
        let wrapper = el.query(By.css('ds-context-help-wrapper')).nativeElement;
        expect(wrapper.children.length).toBe(1);
        let [i] = wrapper.children;
        expect(i.tagName).toBe('I');
        done();
      });
    });

    describe('after the icon is clicked', () => {
      let i;
      beforeEach(() => {
        i = el.query(By.css('.ds-context-help-icon')).nativeElement;
        i.click();
        fixture.detectChanges();
      });

      it('should display the tooltip', () => {
        expect(contextHelpService.toggleTooltip).toHaveBeenCalledWith('test-tooltip');
        getContextHelp$.next({...exampleContextHelp, isTooltipVisible: true});
        fixture.detectChanges();
        expect(wrapperComponent.tooltip.open).toHaveBeenCalled();
        expect(wrapperComponent.tooltip.close).toHaveBeenCalledTimes(0);
      });

      describe('after the icon is clicked again', () => {
        beforeEach(() => {
          i.click();
          fixture.detectChanges();
          spyOn(wrapperComponent.tooltip, 'isOpen').and.returnValue(true);
        });

        it('should close the tooltip', () => {
          expect(contextHelpService.toggleTooltip).toHaveBeenCalledWith('test-tooltip');
          getContextHelp$.next({...exampleContextHelp, isTooltipVisible: false});
          fixture.detectChanges();
          expect(wrapperComponent.tooltip.close).toHaveBeenCalled();
        });
      });
    });
  });

  // TODO: link parsing tests
});
