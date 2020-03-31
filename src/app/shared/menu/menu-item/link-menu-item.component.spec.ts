import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { LinkMenuItemComponent } from './link-menu-item.component';
import { RouterLinkDirectiveStub } from '../../testing/router-link-directive.stub';
import { environment } from '../../../../environments/environment';

describe('LinkMenuItemComponent', () => {
  let component: LinkMenuItemComponent;
  let fixture: ComponentFixture<LinkMenuItemComponent>;
  let debugElement: DebugElement;
  let text;
  let link;

  function init() {
    text = 'HELLO';
    link = 'http://google.com';
  }
  beforeEach(async(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [LinkMenuItemComponent, RouterLinkDirectiveStub],
      providers: [
        { provide: 'itemModelProvider', useValue: { text: text, link: link } },
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
    expect(routerLinkQuery[0].routerLink).toBe(environment.ui.nameSpace + link);
  });
});
