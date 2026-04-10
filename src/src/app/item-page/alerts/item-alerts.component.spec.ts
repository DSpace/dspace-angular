import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { Item } from '../../core/shared/item.model';
import { CorrectionTypeDataService } from '../../core/submission/correctiontype-data.service';
import { CorrectionType } from '../../core/submission/models/correctiontype.model';
import {
  DsoWithdrawnReinstateModalService,
  REQUEST_REINSTATE,
} from '../../shared/dso-page/dso-withdrawn-reinstate-service/dso-withdrawn-reinstate-modal.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../shared/remote-data.utils';
import { ActivatedRouteStub } from '../../shared/testing/active-router.stub';
import { createPaginatedList } from '../../shared/testing/utils.test';
import { ItemAlertsComponent } from './item-alerts.component';

describe('ItemAlertsComponent', () => {
  let component: ItemAlertsComponent;
  let fixture: ComponentFixture<ItemAlertsComponent>;
  let item: Item;
  let authorizationService;
  let dsoWithdrawnReinstateModalService;
  let correctionTypeDataService;
  let testScheduler: TestScheduler;

  const itemMock = Object.assign(new Item(), {
    uuid: 'item-uuid',
    id: 'item-uuid',
  });

  beforeEach(waitForAsync(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', ['isAuthorized']);
    dsoWithdrawnReinstateModalService = jasmine.createSpyObj('dsoWithdrawnReinstateModalService', ['openCreateWithdrawnReinstateModal']);
    correctionTypeDataService = jasmine.createSpyObj('correctionTypeDataService',  ['findByItem']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ItemAlertsComponent, NoopAnimationsModule],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: DsoWithdrawnReinstateModalService, useValue: dsoWithdrawnReinstateModalService },
        { provide: CorrectionTypeDataService, useValue: correctionTypeDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAlertsComponent);

    component = fixture.componentInstance;
    component.item = itemMock;
    fixture.detectChanges();
  });

  describe('when the item is discoverable', () => {
    beforeEach(() => {
      item = Object.assign(new Item(), {
        isDiscoverable: true,
      });
      component.item = item;
      fixture.detectChanges();
    });

    it('should not display the private alert', () => {
      const privateWarning = fixture.debugElement.query(By.css('.private-warning'));
      expect(privateWarning).toBeNull();
    });
  });

  describe('when the item is not discoverable', () => {
    beforeEach(() => {
      item = Object.assign(new Item(), {
        isDiscoverable: false,
      });
      component.item = item;
      fixture.detectChanges();
    });

    it('should display the private alert', () => {
      const privateWarning = fixture.debugElement.query(By.css('.private-warning'));
      expect(privateWarning).not.toBeNull();
    });
  });

  describe('when the item is withdrawn', () => {
    beforeEach(() => {
      item = Object.assign(new Item(), {
        isWithdrawn: true,
      });
      component.item = item;
      (correctionTypeDataService.findByItem).and.returnValue(createSuccessfulRemoteDataObject$([]));
      fixture.detectChanges();
    });

    it('should display the withdrawn alert', () => {
      const privateWarning = fixture.debugElement.query(By.css('.withdrawn-warning'));
      expect(privateWarning).not.toBeNull();
    });
  });

  describe('when the item is not withdrawn', () => {
    beforeEach(() => {
      item = Object.assign(new Item(), {
        isWithdrawn: false,
      });
      component.item = item;
      (correctionTypeDataService.findByItem).and.returnValue(createSuccessfulRemoteDataObject$([]));
      fixture.detectChanges();
    });

    it('should not display the withdrawn alert', () => {
      const privateWarning = fixture.debugElement.query(By.css('.withdrawn-warning'));
      expect(privateWarning).toBeNull();
    });
  });

  describe('when the item is reinstated', () => {
    const correctionType = Object.assign(new CorrectionType(), {
      topic: REQUEST_REINSTATE,
    });
    const correctionRD = createSuccessfulRemoteDataObject(createPaginatedList([correctionType]));

    beforeEach(() => {
      item =  itemMock;
      component.item = item;
      (correctionTypeDataService.findByItem).and.returnValue(of(correctionRD));

      testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
      fixture.detectChanges();
    });

    it('should return true when user is not an admin and there is at least one correction with topic REQUEST_REINSTATE', () => {
      testScheduler.run(({ cold, expectObservable }) => {
        const isAdminMarble = 'a';
        const correctionMarble = 'b';
        const expectedMarble = 'c';

        const isAdminValues = { a: false };
        const correctionValues = { b: correctionRD };
        const expectedValues = { c: true };

        const isAdmin$ = cold(isAdminMarble, isAdminValues);
        const correction$ = cold(correctionMarble, correctionValues);

        (authorizationService.isAuthorized).and.returnValue(isAdmin$);
        (correctionTypeDataService.findByItem).and.returnValue(correction$);

        expectObservable(component.shouldShowReinstateButton()).toBe(expectedMarble, expectedValues);
      });
    });

  });
});
