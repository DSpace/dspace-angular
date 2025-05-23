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
import { of } from 'rxjs';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { RequestService } from '../../../core/data/request.service';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { Collection } from '../../../core/shared/collection.model';
import { DSONameServiceMock } from '../../../shared/mocks/dso-name.service.mock';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { NotificationsServiceStub } from '../../../shared/testing/notifications-service.stub';
import { CollectionRolesComponent } from './collection-roles.component';

describe('CollectionRolesComponent', () => {

  let fixture: ComponentFixture<CollectionRolesComponent>;
  let comp: CollectionRolesComponent;
  let de: DebugElement;

  beforeEach(() => {

    const route = {
      parent: {
        data: of({
          dso: createSuccessfulRemoteDataObject(
            Object.assign(new Collection(), {
              _links: {
                irrelevant: {
                  href: 'irrelevant link',
                },
                adminGroup: {
                  href: 'adminGroup link',
                },
                submittersGroup: {
                  href: 'submittersGroup link',
                },
                itemReadGroup: {
                  href: 'itemReadGroup link',
                },
                bitstreamReadGroup: {
                  href: 'bitstreamReadGroup link',
                },
                workflowGroups: [
                  {
                    name: 'test',
                    href: 'test workflow group link',
                  },
                ],
              },
            }),
          ),
        }),
      },
    };

    const requestService = {
      hasByHref$: () => of(true),
    };

    const groupDataService = {
      findByHref: () => createSuccessfulRemoteDataObject$({}),
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        CollectionRolesComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: DSONameService, useValue: new DSONameServiceMock() },
        { provide: RequestService, useValue: requestService },
        { provide: GroupDataService, useValue: groupDataService },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionRolesComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should display a collection admin role component', (done) => {
    expect(de.query(By.css('ds-comcol-role .collection-admin')))
      .toBeTruthy();
    done();
  });

  it('should display a submitters role component', (done) => {
    expect(de.query(By.css('ds-comcol-role .submitters')))
      .toBeTruthy();
    done();
  });

  it('should display a default item read role component', (done) => {
    expect(de.query(By.css('ds-comcol-role .item_read')))
      .toBeTruthy();
    done();
  });

  it('should display a default bitstream read role component', (done) => {
    expect(de.query(By.css('ds-comcol-role .bitstream_read')))
      .toBeTruthy();
    done();
  });

  it('should display a test workflow role component', (done) => {
    expect(de.query(By.css('ds-comcol-role .test')))
      .toBeTruthy();
    done();
  });
});
