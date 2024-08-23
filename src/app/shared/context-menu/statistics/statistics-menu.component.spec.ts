import {
  async,
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { Item } from '../../../core/shared/item.model';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { StatisticsMenuComponent } from './statistics-menu.component';

describe('StatisticsMenuComponent', () => {
  let component: StatisticsMenuComponent;
  let fixture: ComponentFixture<StatisticsMenuComponent>;

  let authorizationService: AuthorizationDataService;
  let dso: DSpaceObject;

  beforeEach(async(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' },
      },
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true),
    });
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), StatisticsMenuComponent],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsMenuComponent);
    component = fixture.componentInstance;
    component.contextMenuObject = dso;
    fixture.detectChanges();
  });

  it('should check the authorization of the current user', () => {
    expect(authorizationService.isAuthorized).toHaveBeenCalledWith(FeatureID.CanViewUsageStatistics, dso.self, undefined, false);
  });

  describe('when the user is authorized', () => {
    beforeEach(() => {
      (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(observableOf(true));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).not.toBeNull();
    });
  });

  describe('when the user is not authorized', () => {
    beforeEach(() => {
      (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(observableOf(false));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });
});
