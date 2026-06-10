import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AuthorizationDataService } from 'src/app/core/data/feature-authorization/authorization-data.service';
import { Collection } from 'src/app/core/shared/collection.model';

import { CollectionStatusComponent } from './collection-status.component';

describe('CollectionStatusComponent', () => {
  let comp: CollectionStatusComponent;
  let fixture: ComponentFixture<CollectionStatusComponent>;

  const mockCollection: Collection = Object.assign(new Collection(), {
    id: 'test-collection-1-1',
    uuid: 'test-collection-1-1',
    name: 'test-collection-1',
    _links: {
      self: {
        href: 'https://rest.api/collections/test-collection-1-1',
      },
    },
  });

  const collectionPageUrl = `/collections/${mockCollection.uuid}`;

  const routeStub = {
    parent: {
      data: of({ dso: createSuccessfulRemoteDataObject(mockCollection) }),
    },
  };
  let authorizationService: AuthorizationDataService;
  beforeEach(waitForAsync(() => {

    authorizationService = jasmine.createSpyObj('authorizationService', {
      sAuthorized: of(true),
    });

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule.withRoutes([]),
        TranslateModule.forRoot(),
        CollectionStatusComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: AuthorizationDataService, useValue: authorizationService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOnProperty(mockCollection, 'handle', 'get').and.returnValue('fake/handle');
    fixture = TestBed.createComponent(CollectionStatusComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the collection\'s internal id', () => {
    const statusId: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-id')).nativeElement;
    expect(statusId.textContent).toContain(mockCollection.id);
  });

  it('should display the collection\'s handle', () => {
    const statusHandle: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-handle')).nativeElement;
    expect(statusHandle.textContent).toContain(mockCollection.handle);
  });

  it('should display the collection\'s page url', () => {
    const statusCollectionPage: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-collectionPage')).nativeElement;
    expect(statusCollectionPage.textContent).toContain(collectionPageUrl);
  });
});
