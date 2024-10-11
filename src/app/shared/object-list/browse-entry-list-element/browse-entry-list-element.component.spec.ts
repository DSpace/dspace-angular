import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { PaginationService } from '../../../core/pagination/pagination.service';
import { RouteService } from '../../../core/services/route.service';
import { BrowseEntry } from '../../../core/shared/browse-entry.model';
import { DSONameServiceMock } from '../../mocks/dso-name.service.mock';
import { ActivatedRouteStub } from '../../testing/active-router.stub';
import { TruncatePipe } from '../../utils/truncate.pipe';
import { BrowseEntryListElementComponent } from './browse-entry-list-element.component';

let browseEntryListElementComponent: BrowseEntryListElementComponent;
let fixture: ComponentFixture<BrowseEntryListElementComponent>;

const mockValue: BrowseEntry = Object.assign(new BrowseEntry(), {
  type: 'browseEntry',
  value: 'De Langhe Kristof',
});

let paginationService;
let routeService;
const pageParam = 'bbm.page';

function init() {
  paginationService = jasmine.createSpyObj('paginationService', {
    getPageParam: pageParam,
  });

  routeService = jasmine.createSpyObj('routeService', {
    getQueryParameterValue: of('1'),
  });
}
describe('BrowseEntryListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    init();
    TestBed.configureTestingModule({
      imports: [TruncatePipe, BrowseEntryListElementComponent],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: 'objectElementProvider', useValue: { mockValue } },
        { provide: PaginationService, useValue: paginationService },
        { provide: RouteService, useValue: routeService },
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(BrowseEntryListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(BrowseEntryListElementComponent);
    browseEntryListElementComponent = fixture.componentInstance;
  }));

  describe('When the metadata is loaded', () => {
    beforeEach(() => {
      browseEntryListElementComponent.object = mockValue;
      fixture.detectChanges();
    });

    it('should show the value as a link', () => {
      const browseEntryLink = fixture.debugElement.query(By.css('a.lead'));
      expect(browseEntryLink.nativeElement.textContent.trim()).toBe(mockValue.value);
    });
  });
});
