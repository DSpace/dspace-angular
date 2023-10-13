import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { BreadcrumbsService } from './breadcrumbs.service';
import { Breadcrumb } from './breadcrumb/breadcrumb.model';
import { VarDirective } from '../shared/utils/var.directive';
import { By } from '@angular/platform-browser';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../shared/testing/translate-loader.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { DebugElement } from '@angular/core';
import { BreadcrumbTooltipPipe } from './breadcrumb/breadcrumb-tooltip.pipe';
import { TruncateBreadcrumbItemCharactersPipe } from './breadcrumb/truncate-breadcrumb-item-characters.pipe';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadcrumbsServiceMock: BreadcrumbsService;
  let truncateTextPipe: TruncateBreadcrumbItemCharactersPipe;

  const expectBreadcrumb = (listItem: DebugElement, text: string, url: string) => {
    const anchor = listItem.query(By.css('a'));
    const truncatedText = truncateTextPipe.transform(text);
    if (url == null) {
      expect(anchor).toBeNull();
       // remove leading whitespace characters
      const textWithoutSpaces = listItem.nativeElement.innerHTML.trimStart().replace(/^\s+/, '');
      expect(textWithoutSpaces).toEqual(truncatedText);
    } else {
      expect(anchor).toBeInstanceOf(DebugElement);
      expect(anchor.attributes.href).toEqual(url);
       // remove leading whitespace characters
      const textWithoutSpaces = anchor.nativeElement.innerHTML.trimStart().replace(/^\s+/, '');
      expect(textWithoutSpaces).toEqual(truncatedText);
    }
  };

  beforeEach(waitForAsync(() => {
    breadcrumbsServiceMock = {
      breadcrumbs$: observableOf([
        // NOTE: a root breadcrumb is automatically rendered
        new Breadcrumb('bc 1', 'example.com'),
        new Breadcrumb('bc 2', 'another.com'),
        new Breadcrumb('breadcrumb to be truncated', 'truncated.com'),
      ]),
      showBreadcrumbs$: observableOf(true),
    } as BreadcrumbsService;

    TestBed.configureTestingModule({
      declarations: [
        BreadcrumbsComponent,
        VarDirective,
        BreadcrumbTooltipPipe,
        TruncateBreadcrumbItemCharactersPipe,
      ],
      imports: [
        NgbTooltipModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock,
          }
        }),
      ],
      providers: [
        { provide: BreadcrumbsService, useValue: breadcrumbsServiceMock },
        { provide: TruncateBreadcrumbItemCharactersPipe, useClass: TruncateBreadcrumbItemCharactersPipe },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbsComponent);
    truncateTextPipe = TestBed.inject(TruncateBreadcrumbItemCharactersPipe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the breadcrumbs accordingly', () => {
    const breadcrumbs = fixture.debugElement.queryAll(By.css('.breadcrumb-item'));
    expect(breadcrumbs.length).toBe(4);
    expectBreadcrumb(breadcrumbs[0], 'home.breadcrumbs', '/');
    expectBreadcrumb(breadcrumbs[1], 'bc 1', '/example.com');
    expectBreadcrumb(breadcrumbs[2].query(By.css('.text-truncate')), 'bc 2', null);
    expectBreadcrumb(breadcrumbs[3].query(By.css('.text-truncate')), 'breadcrumb...', null);
  });

  it('should show tooltip only for truncated text', () => {
    const breadcrumbs = fixture.debugElement.queryAll(By.css('.breadcrumb-item .text-truncate'));
    expect(breadcrumbs.length).toBe(4);

    const truncatable = breadcrumbs[3];
    truncatable.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    let tooltip = truncatable.parent.query(By.css('div.tooltip-inner'));
    expect(tooltip).not.toBeNull();
    expect(tooltip.nativeElement.innerText).toBe('breadcrumb to be truncated');
    truncatable.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();

    const notTruncatable = breadcrumbs[2];
    notTruncatable.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();
    const tooltip2 = notTruncatable.parent.query(By.css('div.tooltip-inner'));
    expect(tooltip2).toBeNull();
    notTruncatable.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();
  });

});
