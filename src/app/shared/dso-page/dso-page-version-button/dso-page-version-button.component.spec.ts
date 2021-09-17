import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DsoPageVersionButtonComponent } from './dso-page-version-button.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { By } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('DsoPageEditButtonComponent', () => {
  let component: DsoPageVersionButtonComponent;
  let fixture: ComponentFixture<DsoPageVersionButtonComponent>;

  let authorizationService: AuthorizationDataService;
  let dso: Item;

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
      declarations: [DsoPageVersionButtonComponent],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), NgbModule],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoPageVersionButtonComponent);
    component = fixture.componentInstance;
    component.dso = dso;
    fixture.detectChanges();
  });

  it('should check the authorization of the current user', () => {
    expect(authorizationService.isAuthorized).toHaveBeenCalledWith(FeatureID.CanEditMetadata, dso.self);
  });

  describe('when the user is authorized', () => {
    beforeEach(() => {
      (authorizationService.isAuthorized as jasmine.Spy).and.returnValue(observableOf(true));
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should render a link', () => {
      const link = fixture.debugElement.query(By.css('a'));
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
      const link = fixture.debugElement.query(By.css('a'));
      expect(link).toBeNull();
    });
  });
});
