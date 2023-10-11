import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';

import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { AuditItemMenuComponent } from './audit-item-menu.component';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';

describe('AuditItemMenuComponent', () => {
  let component: AuditItemMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<AuditItemMenuComponent>;
  let scheduler: TestScheduler;
  let dso: DSpaceObject;

  const authorizationDataServiceStub = jasmine.createSpyObj('authorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized')
  });

  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      id: 'test-item',
      _links: {
        self: { href: 'test-item-selflink' }
      }
    });

    TestBed.configureTestingModule({
      declarations: [ AuditItemMenuComponent ],
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [
        { provide: 'contextMenuObjectProvider', useValue: dso },
        { provide: 'contextMenuObjectTypeProvider', useValue: DSpaceObjectType.ITEM },
        { provide: AuthorizationDataService, useValue: authorizationDataServiceStub },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(AuditItemMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the user is authorized', () => {
    beforeEach(() => {
      (authorizationDataServiceStub.isAuthorized as jasmine.Spy).and.returnValue(observableOf(true));
      fixture.detectChanges();
    });
    it('should render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).not.toBeNull();
    });

  });

  describe('when the user is not authorized', () => {
    beforeEach(() => {
      (authorizationDataServiceStub.isAuthorized as jasmine.Spy).and.returnValue(observableOf(false));
      fixture.detectChanges();
    });
    it('should not render a button', () => {
      const link = fixture.debugElement.query(By.css('button'));
      expect(link).toBeNull();
    });

  });
});
