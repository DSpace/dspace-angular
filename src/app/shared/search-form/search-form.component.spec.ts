import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SearchFormComponent } from './search-form.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Community } from '../../core/shared/community.model';
import { TranslateModule } from '@ngx-translate/core';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { SearchService } from '../../core/shared/search/search.service';

describe('SearchFormComponent', () => {
  let comp: SearchFormComponent;
  let fixture: ComponentFixture<SearchFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        {
          provide: SearchService,
          useValue: {}
        }
      ],
      declarations: [SearchFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFormComponent);
    comp = fixture.componentInstance; // SearchFormComponent test instance
    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;
  });

  it('should display scopes when available with default and all scopes', () => {

    comp.scopes = objects;
    fixture.detectChanges();
    const select: HTMLElement = de.query(By.css('select')).nativeElement;
    expect(select).toBeDefined();
    const options: HTMLCollection = select.children;
    const defOption: Element = options.item(0);
    expect(defOption.getAttribute('value')).toBe('');

    let index = 1;
    objects.forEach((object) => {
      expect(options.item(index).textContent).toBe(object.name);
      expect(options.item(index).getAttribute('value')).toBe(object.uuid);
      index++;
    });
  });

  it('should not display scopes when empty', () => {
    fixture.detectChanges();
    const select = de.query(By.css('select'));
    expect(select).toBeNull();
  });

  it('should display set query value in input field', fakeAsync(() => {
    const testString = 'This is a test query';
    comp.query = testString;

    fixture.detectChanges();
    tick();
    const queryInput = de.query(By.css('input')).nativeElement;

    expect(queryInput.value).toBe(testString);
  }));

  it('should select correct scope option in scope select', fakeAsync(() => {
    comp.scopes = objects;
    fixture.detectChanges();

    const testCommunity = objects[1];
    comp.scope = testCommunity.id;

    fixture.detectChanges();
    tick();
    const scopeSelect = de.query(By.css('select')).nativeElement;

    expect(scopeSelect.value).toBe(testCommunity.id);
  }));
  // it('should call updateSearch when clicking the submit button with correct parameters', fakeAsync(() => {
  //   comp.query = 'Test String'
  //   fixture.detectChanges();
  //   spyOn(comp, 'updateSearch').and.callThrough();
  //   fixture.detectChanges();
  //
  //   const submit = de.query(By.css('button.search-button')).nativeElement;
  //   const scope = '123456';
  //   const query = 'test';
  //   const select = de.query(By.css('select')).nativeElement;
  //   const input = de.query(By.css('input')).nativeElement;
  //
  //   tick();
  //   select.value = scope;
  //   input.value = query;
  //
  //   fixture.detectChanges();
  //
  //   submit.click();
  //
  //   expect(comp.updateSearch).toHaveBeenCalledWith({ scope: scope, query: query });
  // }));
});

export const objects: DSpaceObject[] = [
  Object.assign(new Community(), {
    handle: '10673/11',
    logo: {
      self: {
        _isScalar: true,
        value: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/10b636d0-7890-4968-bcd6-0d83bf4e2b42',
        scheduler: null
      }
    },
    collections: {
      self: {
        _isScalar: true,
        value: '1506937433727',
        scheduler: null
      }
    },
    _links: {
      self: {
        href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/communities/7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
      },
    },
    id: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
    uuid: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
    type: Community.type,
    metadata: {
      'dc.description': [
        {
          language: null,
          value: ''
        }
      ],
      'dc.description.abstract': [
        {
          language: null,
          value: 'This is a test community to hold content for the OR2017 demostration'
        }
      ],
      'dc.description.tableofcontents': [
        {
          language: null,
          value: ''
        }
      ],
      'dc.rights': [
        {
          language: null,
          value: ''
        }
      ],
      'dc.title': [
        {
          language: null,
          value: 'OR2017 - Demonstration'
        }
      ]
    }
  }),
  Object.assign(new Community(),
    {
      handle: '10673/1',
      logo: {
        self: {
          _isScalar: true,
          value: 'https://dspace7.4science.it/dspace-spring-rest/api/core/bitstreams/f446c17d-6d51-45ea-a610-d58a73642d40',
          scheduler: null
        }
      },
      collections: {
        self: {
          _isScalar: true,
          value: '1506937433727',
          scheduler: null
        }
      },
      _links: {
        self: {
          href: 'https://dspace7.4science.it/dspace-spring-rest/api/core/communities/9076bd16-e69a-48d6-9e41-0238cb40d863',
        },
      },
      id: '9076bd16-e69a-48d6-9e41-0238cb40d863',
      uuid: '9076bd16-e69a-48d6-9e41-0238cb40d863',
      type: Community.type,
      metadata: {
        'dc.description': [
          {
            language: null,
            value: '<p>This is the introductory text for the <em>Sample Community</em> on the DSpace Demonstration Site. It is editable by System or Community Administrators (of this Community).</p>\r\n<p><strong>DSpace Communities may contain one or more Sub-Communities or Collections (of Items).</strong></p>\r\n<p>This particular Community has its own logo (the <a href=\'http://www.duraspace.org/\'>DuraSpace</a> logo).</p>'
          }
        ],
        'dc.description.abstract': [
          {
            language: null,
            value: 'This is a sample top-level community'
          }
        ],
        'dc.description.tableofcontents': [
          {
            language: null,
            value: '<p>This is the <em>news section</em> for this <em>Sample Community</em>. System or Community Administrators (of this Community) can edit this News field.</p>'
          }
        ],
        'dc.rights': [
          {
            language: null,
            value: '<p><em>If this Community had special copyright text to display, it would be displayed here.</em></p>'
          }
        ],
        'dc.title': [
          {
            language: null,
            value: 'Sample Community'
          }
        ]
      }
    }
  )
];
