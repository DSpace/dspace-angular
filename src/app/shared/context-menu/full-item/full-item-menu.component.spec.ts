import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TestScheduler } from 'rxjs/testing';
import { getTestScheduler } from 'jasmine-marbles';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { DSpaceObjectType } from '../../../core/shared/dspace-object-type.model';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { Item } from '../../../core/shared/item.model';
import { FullItemMenuComponent } from './full-item-menu.component';
import { AuthService } from '../../../core/auth/auth.service';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('FullItemMenuComponent', () => {
  let component: FullItemMenuComponent;
  let componentAsAny: any;
  let fixture: ComponentFixture<FullItemMenuComponent>;
  let scheduler: TestScheduler;
  let dso: DSpaceObject;
  let router: Router;

  const authServiceStub = jasmine.createSpyObj('authorizationService', {
    getAuthenticatedUserFromStore: jasmine.createSpy('getAuthenticatedUserFromStore'),
    isAuthenticated: jasmine.createSpy('isAuthenticated')
  });

  beforeEach(waitForAsync(() => {
    dso = Object.assign(new Item(), {
      'entityType': 'Publication',
      'id': '12345',
      'uuid': '12345',
      'type': 'item',
      'metadata': {
        'dspace.entity.type': [
          {
            'uuid': '1234567890',
            'language': null,
            'value': 'Publication',
            'place': 0,
            'authority': null,
            'confidence': -1
          }
        ]
      }
    });

    TestBed.configureTestingModule({
      declarations: [ FullItemMenuComponent ],
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
        { provide: AuthService, useValue: authServiceStub },
      ]
    }).compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    scheduler = getTestScheduler();
    fixture = TestBed.createComponent(FullItemMenuComponent);
    component = fixture.componentInstance;
    componentAsAny = fixture.componentInstance;
    component.contextMenuObject = dso;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button', () => {
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).not.toBeNull();
  });

  it('should not render a button', () => {
    spyOnProperty(router, 'url', 'get').and.returnValue('/entities/publication/12345/full');
    fixture.detectChanges();
    const link = fixture.debugElement.query(By.css('button'));
    expect(link).toBeNull();
  });

});
