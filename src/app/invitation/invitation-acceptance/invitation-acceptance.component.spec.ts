import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { InvitationAcceptanceComponent } from './invitation-acceptance.component';
import { RouterMock } from '../../shared/mocks/router.mock';
import { ActivatedRoute, convertToParamMap, Params, Router } from '@angular/router';
import { Observable, of as observableOf } from 'rxjs';
import { Registration } from '../../core/shared/registration.model';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { createSuccessfulRemoteDataObject$ } from '../../shared/remote-data.utils';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthService } from '../../core/auth/auth.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { By } from '@angular/platform-browser';
import { RemoteData } from '../../core/data/remote-data';

describe('InvitationAcceptanceComponent', () => {
  let component: InvitationAcceptanceComponent;
  let fixture: ComponentFixture<InvitationAcceptanceComponent>;
  const route = new RouterMock();
  const registrationWithGroups = Object.assign(new Registration(),
    {
      email: 'test@email.org',
      token: 'test-token',
      groups: ['group1UUID', 'group2UUID'],
      groupNames: ['group1', 'group2']
    });
  const epersonRegistrationService = jasmine.createSpyObj('epersonRegistrationService', {
    searchByTokenAndUpdateData: createSuccessfulRemoteDataObject$(registrationWithGroups)
  });
  const ePersonDataServiceStub = {
    acceptInvitationToJoinGroups(person: EPerson): Observable<RemoteData<EPerson>> {
      return createSuccessfulRemoteDataObject$(person);
    }
  };
  const ePerson = Object.assign(new EPerson(), {
    id: 'test-eperson',
    uuid: 'test-eperson'
  });
  const paramObject: Params = {};
  paramObject.registrationToken = '1234';
  const authService = {
    getAuthenticatedUserFromStore: () => observableOf(ePerson)
  } as AuthService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InvitationAcceptanceComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        })
      ],
      providers: [{provide: Router, useValue: route},
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: observableOf(convertToParamMap(paramObject))
          },
        },
        {provide: EpersonRegistrationService, useValue: epersonRegistrationService},
        {provide: EPersonDataService, useValue: ePersonDataServiceStub},
        {provide: AuthService, useValue: authService}
      ]
    })
      .compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(InvitationAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create component invitation', () => {
    expect(component).toBeTruthy();
  });
  it('should show group names list', () => {
    const subComList = fixture.debugElement.queryAll(By.css('li'));
    expect(subComList).toHaveSize(2);
  });
  describe('when user chooses option accept or ignore', () => {
    beforeEach(fakeAsync(() => {
      const ignoreButton = fixture.debugElement.queryAll(By.css('button'))[1];
      ignoreButton.triggerEventHandler('click', {
        preventDefault: () => {/**/
        }
      });
      tick();
      fixture.detectChanges();
    }));
    it('when user clicks accept should be redirected to mydspace page', () => {
      expect(route.navigate).toHaveBeenCalledWith(['/home']);
    });
    beforeEach(fakeAsync(() => {
      const ignoreButton = fixture.debugElement.queryAll(By.css('button'))[0];
      ignoreButton.triggerEventHandler('click', {
        preventDefault: () => {/**/
        }
      });
      tick();
      fixture.detectChanges();
    }));
    it('when user clicks ignore should be redirected to home page', () => {
      expect(route.navigate).toHaveBeenCalledWith(['/home']);
    });
    beforeEach(fakeAsync(() => {
      spyOn(component, 'navigateToHome');
      const ignoreButton = fixture.debugElement.queryAll(By.css('button'))[0];
      ignoreButton.triggerEventHandler('click', {
        preventDefault: () => {/**/
        }
      });
      tick();
      fixture.detectChanges();
    }));
    it('when user clicks ignore method ignore should be triggered', () => {
      expect(component.navigateToHome).toHaveBeenCalled();
    });

    beforeEach(fakeAsync(() => {
      spyOn(component, 'accept');
      const ignoreButton = fixture.debugElement.queryAll(By.css('button'))[1];
      ignoreButton.triggerEventHandler('click', {
        preventDefault: () => {/**/
        }
      });
      tick();
      fixture.detectChanges();
    }));
    it('when user clicks accept method accept should be triggered', () => {
      expect(component.accept).toHaveBeenCalled();
    });

  });

});
