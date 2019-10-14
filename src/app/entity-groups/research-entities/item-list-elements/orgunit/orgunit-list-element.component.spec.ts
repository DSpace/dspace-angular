import { async, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { OrgUnitListElementComponent } from './orgunit-list-element.component';
import { of as observableOf } from 'rxjs';
import { Item } from '../../../../core/shared/item.model';
import { TruncatePipe } from '../../../../shared/utils/truncate.pipe';
import { TruncatableService } from '../../../../shared/truncatable/truncatable.service';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: observableOf({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title'
      }
    ],
    'dc.description': [
      {
        language: 'en_US',
        value: 'A description about the OrgUnit'
      }
    ]
  }
});

describe('OrgunitListElementComponent',
  () => {
    let comp;
    let fixture;

    const truncatableServiceStub: any = {
      isCollapsed: (id: number) => observableOf(true),
    };

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        declarations: [OrgUnitListElementComponent, TruncatePipe],
        providers: [
          { provide: TruncatableService, useValue: truncatableServiceStub },
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).overrideComponent(OrgUnitListElementComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      }).compileComponents();
    }));

    beforeEach(async(() => {
      fixture = TestBed.createComponent(OrgUnitListElementComponent);
      comp = fixture.componentInstance;
    }));

    describe(`when the orgunit is rendered`, () => {
      beforeEach(() => {
        comp.object = mockItem;
        fixture.detectChanges();
      });

      it(`should contain a OrgUnitListElementComponent`, () => {
        const orgunitListElement = fixture.debugElement.query(By.css(`ds-orgunit-search-result-list-element`));
        expect(orgunitListElement).not.toBeNull();
      });
    });

  });