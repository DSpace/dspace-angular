import {
  DebugElement,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of as observableOf } from 'rxjs';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { RequestService } from '../../../core/data/request.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { Community } from '../../../core/shared/community.model';
import { DSONameServiceMock } from '../../../shared/mocks/dso-name.service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { CommunityRolesComponent } from './community-roles.component';

describe('CommunityRolesComponent', () => {

  let fixture: ComponentFixture<CommunityRolesComponent>;
  let comp: CommunityRolesComponent;
  let de: DebugElement;

  beforeEach(() => {

    const route = {
      parent: {
        data: observableOf({
          dso: createSuccessfulRemoteDataObject(
            Object.assign(new Community(), {
              _links: {
                irrelevant: {
                  href: 'irrelevant link',
                },
                adminGroup: {
                  href: 'adminGroup link',
                },
              },
            }),
          ),
        }),
      },
    };

    const requestService = {
      hasByHref$: () => observableOf(true),
    };

    const groupDataService = {
      findByHref: () => createSuccessfulRemoteDataObject$({}),
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        CommunityRolesComponent,
      ],
      providers: [
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: ActivatedRoute, useValue: route },
        { provide: RequestService, useValue: requestService },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityRolesComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should display a community admin role component', (done) => {
    expect(de.query(By.css('ds-comcol-role .community-admin')))
      .toBeTruthy();
    done();
  });
});
