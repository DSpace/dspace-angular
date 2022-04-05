import { BrowseBySwitcherComponent } from './browse-by-switcher.component';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BROWSE_BY_COMPONENT_FACTORY, BrowseByDataType } from './browse-by-decorator';
import { BrowseDefinition } from '../../core/shared/browse-definition.model';
import { BehaviorSubject, of as observableOf } from 'rxjs';

describe('BrowseBySwitcherComponent', () => {
  let comp: BrowseBySwitcherComponent;
  let fixture: ComponentFixture<BrowseBySwitcherComponent>;

  const types = [
    Object.assign(
      new BrowseDefinition(), {
        id: 'title',
        dataType: BrowseByDataType.Title,
      }
    ),
    Object.assign(
      new BrowseDefinition(), {
        id: 'dateissued',
        dataType: BrowseByDataType.Date,
        metadataKeys: ['dc.date.issued']
      }
    ),
    Object.assign(
      new BrowseDefinition(), {
        id: 'author',
        dataType: BrowseByDataType.Metadata,
      }
    ),
    Object.assign(
      new BrowseDefinition(), {
        id: 'subject',
        dataType: BrowseByDataType.Metadata,
      }
    ),
  ];

  const data = new BehaviorSubject(createDataWithBrowseDefinition(new BrowseDefinition()));

  const activatedRouteStub = {
    data
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BrowseBySwitcherComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: BROWSE_BY_COMPONENT_FACTORY, useValue: jasmine.createSpy('getComponentByBrowseByType').and.returnValue(null) }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(BrowseBySwitcherComponent);
    comp = fixture.componentInstance;
  }));

  types.forEach((type: BrowseDefinition) => {
    describe(`when switching to a browse-by page for "${type.id}"`, () => {
      beforeEach(() => {
        data.next(createDataWithBrowseDefinition(type));
        fixture.detectChanges();
      });

      it(`should call getComponentByBrowseByType with type "${type.dataType}"`, () => {
        expect((comp as any).getComponentByBrowseByType).toHaveBeenCalledWith(type.dataType);
      });
    });
  });
});

export function createDataWithBrowseDefinition(browseDefinition) {
  return { browseDefinition: browseDefinition };
}
