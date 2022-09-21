import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { of as observableOf } from 'rxjs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { PersonPageClaimButtonComponent } from './person-page-claim-button.component';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { TranslateLoaderMock } from '../../mocks/translate-loader.mock';
import { ResearcherProfileDataService } from '../../../core/profile/researcher-profile-data.service';
import { RouteService } from '../../../core/services/route.service';
import { routeServiceStub } from '../../testing/route-service.stub';
import { Item } from '../../../core/shared/item.model';
import { ResearcherProfile } from '../../../core/profile/model/researcher-profile.model';
import { createFailedRemoteDataObject$, createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';

describe('PersonPageClaimButtonComponent', () => {
  let scheduler: TestScheduler;
  let component: PersonPageClaimButtonComponent;
  let fixture: ComponentFixture<PersonPageClaimButtonComponent>;

  const mockItem: Item = Object.assign(new Item(), {
    metadata: {
      'person.email': [
        {
          language: 'en_US',
          value: 'fake@email.com'
        }
      ],
      'person.birthDate': [
        {
          language: 'en_US',
          value: '1993'
        }
      ],
      'person.jobTitle': [
        {
          language: 'en_US',
          value: 'Developer'
        }
      ],
      'person.familyName': [
        {
          language: 'en_US',
          value: 'Doe'
        }
      ],
      'person.givenName': [
        {
          language: 'en_US',
          value: 'John'
        }
      ]
    },
    _links: {
      self: {
        href: 'item-href'
      }
    }
  });

  const mockResearcherProfile: ResearcherProfile = Object.assign(new ResearcherProfile(), {
    id: 'test-id',
    visible: true,
    type: 'profile',
    _links: {
      item: {
        href: 'https://rest.api/rest/api/profiles/test-id/item'
      },
      self: {
        href: 'https://rest.api/rest/api/profiles/test-id'
      },
    }
  });

  const notificationsService = new NotificationsServiceStub();

  const authorizationDataService = jasmine.createSpyObj('authorizationDataService', {
    isAuthorized: jasmine.createSpy('isAuthorized')
  });

  const researcherProfileService = jasmine.createSpyObj('researcherProfileService', {
    createFromExternalSource: jasmine.createSpy('createFromExternalSource'),
    findRelatedItemId: jasmine.createSpy('findRelatedItemId'),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      declarations: [PersonPageClaimButtonComponent],
      providers: [
        { provide: AuthorizationDataService, useValue: authorizationDataService },
        { provide: NotificationsService, useValue: notificationsService },
        { provide: ResearcherProfileDataService, useValue: researcherProfileService },
        { provide: RouteService, useValue: routeServiceStub },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPageClaimButtonComponent);
    component = fixture.componentInstance;
    component.object = mockItem;
  });

  describe('when item can be claimed', () => {
    beforeEach(() => {
      authorizationDataService.isAuthorized.and.returnValue(observableOf(true));
      researcherProfileService.createFromExternalSource.calls.reset();
      researcherProfileService.findRelatedItemId.calls.reset();
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should create claim button', () => {
      const btn = fixture.debugElement.query(By.css('[data-test="item-claim"]'));
      expect(btn).toBeTruthy();
    });

    describe('claim', () => {
      describe('when successfully', () => {
        beforeEach(() => {
          scheduler = getTestScheduler();
          researcherProfileService.createFromExternalSource.and.returnValue(createSuccessfulRemoteDataObject$(mockResearcherProfile));
          researcherProfileService.findRelatedItemId.and.returnValue(observableOf('test-id'));
        });

        it('should display success notification', () => {
          scheduler.schedule(() => component.claim());
          scheduler.flush();

          expect(researcherProfileService.findRelatedItemId).toHaveBeenCalled();
          expect(notificationsService.success).toHaveBeenCalled();
        });
      });

      describe('when not successfully', () => {
        beforeEach(() => {
          scheduler = getTestScheduler();
          researcherProfileService.createFromExternalSource.and.returnValue(createFailedRemoteDataObject$());
        });

        it('should display success notification', () => {
          scheduler.schedule(() => component.claim());
          scheduler.flush();

          expect(researcherProfileService.findRelatedItemId).not.toHaveBeenCalled();
          expect(notificationsService.error).toHaveBeenCalled();
        });
      });
    });

  });

  describe('when item cannot be claimed', () => {
    beforeEach(() => {
      authorizationDataService.isAuthorized.and.returnValue(observableOf(false));
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should create claim button', () => {
      const btn = fixture.debugElement.query(By.css('[data-test="item-claim"]'));
      expect(btn).toBeFalsy();
    });

  });
});
