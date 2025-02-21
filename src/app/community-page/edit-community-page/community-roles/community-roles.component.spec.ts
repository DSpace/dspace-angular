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

import { DSONameService } from '@dspace/core';
import { RequestService } from '@dspace/core';
import { GroupDataService } from '@dspace/core';
import { NotificationsService } from '@dspace/core';
import { Community } from '@dspace/core';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core';
import { NotificationsServiceStub } from '@dspace/core';
import { DSONameServiceMock } from '../../../shared/mocks/dso-name.service.mock';
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
