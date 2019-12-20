import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LinkMenuItemComponent } from './link-menu-item.component';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive-stub';
import { GLOBAL_CONFIG } from '../../../../config';

describe('LinkMenuItemComponent', () => {
  let component: LinkMenuItemComponent;
  let fixture: ComponentFixture<LinkMenuItemComponent>;
  let debugElement: DebugElement;
  let text;
  let link;
  let nameSpace;
  let globalConfig;

  function init() {
    text = 'HELLO';
    link = 'http://google.com';
    nameSpace = 'dspace.com/';
    globalConfig = {
      ui: {
        nameSpace: nameSpace
      }
    } as any;
  }
  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LinkMenuItemComponent, RouterLinkDirectiveStub],
      providers: [
        { provide: 'itemModelProvider', useValue: { text: text, link: link } },
        { provide: GLOBAL_CONFIG, useValue: globalConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA]
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
    expect(routerLinkQuery[0].routerLink).toBe(nameSpace + link);
  });
});
