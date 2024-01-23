import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ItemAlertsComponent } from './item-alerts.component';
import { TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { By } from '@angular/platform-browser';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { of } from 'rxjs';
import { DsoWithdrawnReinstateModalService } from '../../shared/dso-page/dso-withdrawn-reinstate-service/dso-withdrawn-reinstate-modal.service';
import { CorrectionTypeDataService } from '../../core/submission/correctiontype-data.service';

describe('ItemAlertsComponent', () => {
  let component: ItemAlertsComponent;
  let fixture: ComponentFixture<ItemAlertsComponent>;
  let item: Item;
  let authorizationService;
  let dsoWithdrawnReinstateModalService;
  let correctionTypeDataService;

  beforeEach(waitForAsync(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true)
    });
    dsoWithdrawnReinstateModalService = jasmine.createSpyObj('dsoWithdrawnReinstateModalService', {
      openCreateWithdrawnReinstateModal: {}
    });
    correctionTypeDataService = jasmine.createSpyObj('correctionTypeDataService', {
      findByItem: of({})
    });
    TestBed.configureTestingModule({
      declarations: [ItemAlertsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: DsoWithdrawnReinstateModalService, useValue: dsoWithdrawnReinstateModalService },
        { provide: CorrectionTypeDataService, useValue: correctionTypeDataService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when the item is discoverable', () => {
    beforeEach(() => {
      item = Object.assign(new Item(), {
        isDiscoverable: true
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
        isDiscoverable: false
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
        isWithdrawn: true
      });
      component.item = item;
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
        isWithdrawn: false
      });
      component.item = item;
      fixture.detectChanges();
    });

    it('should not display the withdrawn alert', () => {
      const privateWarning = fixture.debugElement.query(By.css('.withdrawn-warning'));
      expect(privateWarning).toBeNull();
    });
  });
});
