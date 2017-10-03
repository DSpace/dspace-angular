import { ComponentFixture, TestBed, async, tick, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceType } from '../../core/shared/resource-type';
import { Community } from '../../core/shared/community.model';
import { TranslateModule } from '@ngx-translate/core';
import { SearchResultsComponent } from './search-results.component';

describe('SearchResultsComponent', () => {
  let comp: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let heading: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      declarations: [SearchResultsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultsComponent);
    comp = fixture.componentInstance; // SearchFormComponent test instance
    heading = fixture.debugElement.query(By.css('heading'));
  });

  it('should display heading when results are not empty', fakeAsync(() => {
    (comp as any).searchResults = 'test';
    (comp as any).searchConfig = {pagination: ''};
    fixture.detectChanges();
    tick();
    expect(heading).toBeDefined();
  }));

  it('should not display heading when results is empty', () => {
    expect(heading).toBeNull();
  });
});

export const objects = [
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
    self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/communities/7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
    id: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
    uuid: '7669c72a-3f2a-451f-a3b9-9210e7a4c02f',
    type: ResourceType.Community,
    name: 'OR2017 - Demonstration',
    metadata: [
      {
        key: 'dc.description',
        language: null,
        value: ''
      },
      {
        key: 'dc.description.abstract',
        language: null,
        value: 'This is a test community to hold content for the OR2017 demostration'
      },
      {
        key: 'dc.description.tableofcontents',
        language: null,
        value: ''
      },
      {
        key: 'dc.rights',
        language: null,
        value: ''
      },
      {
        key: 'dc.title',
        language: null,
        value: 'OR2017 - Demonstration'
      }
    ]
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
      self: 'https://dspace7.4science.it/dspace-spring-rest/api/core/communities/9076bd16-e69a-48d6-9e41-0238cb40d863',
      id: '9076bd16-e69a-48d6-9e41-0238cb40d863',
      uuid: '9076bd16-e69a-48d6-9e41-0238cb40d863',
      type: ResourceType.Community,
      name: 'Sample Community',
      metadata: [
        {
          key: 'dc.description',
          language: null,
          value: '<p>This is the introductory text for the <em>Sample Community</em> on the DSpace Demonstration Site. It is editable by System or Community Administrators (of this Community).</p>\r\n<p><strong>DSpace Communities may contain one or more Sub-Communities or Collections (of Items).</strong></p>\r\n<p>This particular Community has its own logo (the <a href=\'http://www.duraspace.org/\'>DuraSpace</a> logo).</p>'
        },
        {
          key: 'dc.description.abstract',
          language: null,
          value: 'This is a sample top-level community'
        },
        {
          key: 'dc.description.tableofcontents',
          language: null,
          value: '<p>This is the <em>news section</em> for this <em>Sample Community</em>. System or Community Administrators (of this Community) can edit this News field.</p>'
        },
        {
          key: 'dc.rights',
          language: null,
          value: '<p><em>If this Community had special copyright text to display, it would be displayed here.</em></p>'
        },
        {
          key: 'dc.title',
          language: null,
          value: 'Sample Community'
        }
      ]
    }
  )
];
