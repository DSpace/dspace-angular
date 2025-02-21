import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ActivatedRouteStub } from '../../../../../modules/core/src/lib/core/utilities/testing/active-router.stub';
import { QueryParamsDirectiveStub } from '../../../../../modules/core/src/lib/core/utilities/testing/query-params-directive.stub';
import { RouterStub } from '../../../../../modules/core/src/lib/core/utilities/testing/router.stub';
import { RouterLinkDirectiveStub } from '../../../../../modules/core/src/lib/core/utilities/testing/router-link-directive.stub';
import { LinkMenuItemComponent } from './link-menu-item.component';

describe('LinkMenuItemComponent', () => {
  let component: LinkMenuItemComponent;
  let fixture: ComponentFixture<LinkMenuItemComponent>;
  let debugElement: DebugElement;
  let text;
  let link;
  let queryParams;

  function init() {
    text = 'HELLO';
    link = '/world/hello';
    queryParams = { params: true };
  }

  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), LinkMenuItemComponent],
      providers: [
        { provide: 'itemModelProvider', useValue: { text: text, link: link, queryParams: queryParams } },
        { provide: Router, useValue: new RouterStub() },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        RouterLinkDirectiveStub,
        QueryParamsDirectiveStub,
        RouterLink,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(LinkMenuItemComponent, {
        remove: { imports: [] },
        add: { imports: [RouterLinkDirectiveStub, QueryParamsDirectiveStub] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkMenuItemComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain the correct text', () => {
    const textContent = debugElement.query(By.css('a')).nativeElement.textContent;
    expect(textContent).toEqual(text);
  });

  it('should have the right routerLink attribute', () => {
    const linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    const routerLinkQuery = linkDes.map((de) => de.injector.get(RouterLinkDirectiveStub));

    expect(routerLinkQuery.length).toBe(1);
    expect(routerLinkQuery[0].routerLink).toBe(link);
  });

  it('should have the right queryParams attribute', () => {
    const queryDes = fixture.debugElement.queryAll(By.directive(QueryParamsDirectiveStub));
    const routerParamsQuery = queryDes.map((de) => de.injector.get(QueryParamsDirectiveStub));

    expect(routerParamsQuery.length).toBe(1);
    expect(routerParamsQuery[0].queryParams).toBe(queryParams);
  });
});
