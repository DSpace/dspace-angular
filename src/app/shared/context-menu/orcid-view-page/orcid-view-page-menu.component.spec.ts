import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { of as observableOf } from 'rxjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { OrcidViewPageMenuComponent } from './orcid-view-page-menu.component';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';

describe('OrcidViewPageMenuComponent', () => {
  let component: OrcidViewPageMenuComponent;
  let fixture: ComponentFixture<OrcidViewPageMenuComponent>;

  let authorizationService: AuthorizationDataService;
  let dso: DSpaceObject;

  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: observableOf(true)
    });
    TestBed.configureTestingModule({
      declarations: [OrcidViewPageMenuComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: AuthorizationDataService, useValue: authorizationService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcidViewPageMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should check the authorization of the current user', () => {
    expect(authorizationService.isAuthorized).toHaveBeenCalledWith(FeatureID.CanSynchronizeWithORCID, dso.self);
  });

  describe('when the user is authorized', () => {
    beforeEach(() => {
      (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(observableOf(true));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render a link', () => {
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

    it('should not render a link', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });
  });
});
