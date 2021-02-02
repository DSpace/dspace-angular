import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DsoPageEditMenuComponent } from './dso-page-edit-menu.component';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { Item } from '../../../core/shared/item.model';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { of as observableOf } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureID } from '../../../core/data/feature-authorization/feature-id';
import { By } from '@angular/platform-browser';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';

describe('DsoPageEditMenuComponent', () => {
  let component: DsoPageEditMenuComponent;
  let fixture: ComponentFixture<DsoPageEditMenuComponent>;

  let authorizationService: AuthorizationDataService;
  let dso: DSpaceObject;

  beforeEach(async(() => {
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
      declarations: [ DsoPageEditMenuComponent ],
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DsoPageEditMenuComponent);
    component = fixture.componentInstance;
    component.contextMenuObject = dso;
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
