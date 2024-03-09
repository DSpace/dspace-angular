import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of as observableOf } from 'rxjs';

import { DSONameService } from '../../../../core/breadcrumbs/dso-name.service';
import { Item } from '../../../../core/shared/item.model';
import { DSONameServiceMock } from '../../../../shared/mocks/dso-name.service.mock';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { OrgUnitListElementComponent } from './org-unit-list-element.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'A description about the OrgUnit',
      },
    ],
  },
});

describe('OrgUnitListElementComponent', () => {
  let comp;
  let fixture;

  const truncatableServiceStub: any = {
    isCollapsed: (id: number) => observableOf(true),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [OrgUnitListElementComponent, TruncatePipe],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: TruncatableService, useValue: truncatableServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(OrgUnitListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(OrgUnitListElementComponent);
    comp = fixture.componentInstance;
  }));

  describe(`when the org unit is rendered`, () => {
    beforeEach(() => {
      comp.object = mockItem;
      fixture.detectChanges();
    });

    it(`should contain a OrgUnitListElementComponent`, () => {
      const orgUnitListElement = fixture.debugElement.query(By.css(`ds-org-unit-search-result-list-element`));
      expect(orgUnitListElement).not.toBeNull();
    });
  });
});
