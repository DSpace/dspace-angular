import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of as observableOf, Observable, BehaviorSubject } from 'rxjs';
import { ContextHelpWrapperComponent } from './context-help-wrapper.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ContextHelpService } from '../context-help.service';
import { ContextHelp } from '../context-help.model';

describe('ContextHelpWrapperComponent', () => {
  let component: ContextHelpWrapperComponent;
  let fixture: ComponentFixture<ContextHelpWrapperComponent>;
  let translateService: any;
  let contextHelpService: any;
  let getContextHelp$: BehaviorSubject<ContextHelp>;
  let shouldShowIcons$: BehaviorSubject<boolean>;

  const messages = {
    lorem: 'lorem ipsum dolor sit amet',
    linkTest: 'This is text, [this](https://dspace.lyrasis.org) is a link, and [so is this](https://google.com)'
  };
  function makeWrappedElement(): HTMLElement {
    let el: HTMLElement = document.createElement('div')
    el.innerHTML = 'example element';
    return el;
  }

  beforeEach(waitForAsync( () => {
    translateService = jasmine.createSpyObj('translateService', ['get']);
    translateService.get.and.callFake((content) => messages[content]);

    contextHelpService = jasmine.createSpyObj('contextHelpService', [
      'shouldShowIcons$',
      'getContextHelp$',
      'add'
    ])
    TestBed.configureTestingModule({
      imports: [ NgbTooltipModule ],
      providers: [
        { provide: TranslateService, useValue: translateService },
        { provide: ContextHelpService, useValue: contextHelpService },
      ],
      declarations: [ ContextHelpWrapperComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    contextHelpService.getContextHelp$.and.returnValue(getContextHelp$);
    contextHelpService.shouldShowIcons$.and.returnValue(shouldShowIcons$);
    getContextHelp$.next({
      id: 'example-id',
      isTooltipVisible: false
    });
    shouldShowIcons$.next(false);

    fixture = TestBed.createComponent(ContextHelpWrapperComponent);
    component = fixture.componentInstance;
    component.templateRef
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
