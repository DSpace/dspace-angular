import { ComponentFixture, TestBed} from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of as observableOf } from 'rxjs/internal/observable/of';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RemoteData } from '../../../core/data/remote-data';
import { CollectionRolesComponent } from './collection-roles.component';
import { Collection } from '../../../core/shared/collection.model';
import { SharedModule } from '../../../shared/shared.module';
import { GroupDataService } from '../../../core/eperson/group-data.service';
import { RequestService } from '../../../core/data/request.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('CollectionRolesComponent', () => {

  let fixture: ComponentFixture<CollectionRolesComponent>;
  let comp: CollectionRolesComponent;
  let de: DebugElement;

  beforeEach(() => {

    const route = {
      parent: {
        data: observableOf({
          dso: new RemoteData(
            false,
            false,
            true,
            undefined,
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
        })
      }
    };

    const requestService = {
      hasByHrefObservable: () => observableOf(true),
    };

    const groupDataService = {
      findByHref: () => observableOf(new RemoteData(
        false,
        false,
        true,
        undefined,
        {},
        200,
      )),
    };

    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
      ],
      declarations: [
        CollectionRolesComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: route },
        { provide: RequestService, useValue: requestService },
        { provide: GroupDataService, useValue: groupDataService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionRolesComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;

    fixture.detectChanges();
  });

  it('should display a collection admin role component', () => {
    expect(de.query(By.css('ds-comcol-role .collection-admin')))
      .toBeTruthy();
  });

  it('should display a submitters role component', () => {
    expect(de.query(By.css('ds-comcol-role .submitters')))
      .toBeTruthy();
  });

  it('should display a default item read role component', () => {
    expect(de.query(By.css('ds-comcol-role .item_read')))
      .toBeTruthy();
  });

  it('should display a default bitstream read role component', () => {
    expect(de.query(By.css('ds-comcol-role .bitstream_read')))
      .toBeTruthy();
  });

  it('should display a test workflow role component', () => {
    expect(de.query(By.css('ds-comcol-role .test')))
      .toBeTruthy();
  });
});
