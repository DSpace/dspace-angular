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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ConfigurationDataService } from '../../../core/data/configuration-data.service';
import { AuthorizationDataService } from '../../../core/data/feature-authorization/authorization-data.service';
import { IdentifierDataService } from '../../../core/data/identifier-data.service';
import { OrcidAuthService } from '../../../core/orcid/orcid-auth.service';
import { ConfigurationProperty } from '../../../core/shared/configuration-property.model';
import { Item } from '../../../core/shared/item.model';
import { HostWindowService } from '../../../shared/host-window.service';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../../shared/remote-data.utils';
import { HostWindowServiceStub } from '../../../shared/testing/host-window-service.stub';
import { ItemStatusComponent } from './item-status.component';

let mockIdentifierDataService: IdentifierDataService;
let mockConfigurationDataService: ConfigurationDataService;

describe('ItemStatusComponent', () => {
  let comp: ItemStatusComponent;
  let fixture: ComponentFixture<ItemStatusComponent>;

  const mockItem = Object.assign(new Item(), {
    id: 'fake-id',
    uuid: 'fake-id',
    handle: 'fake/handle',
    lastModified: '2018',
    _links: {
      self: { href: 'test-item-selflink' },
    },
  });

  mockIdentifierDataService = jasmine.createSpyObj('mockIdentifierDataService', {
    getIdentifierDataFor: createSuccessfulRemoteDataObject$({ 'identifiers': [] }),
    getIdentifierRegistrationConfiguration: createSuccessfulRemoteDataObject$('true'),
  });

  mockConfigurationDataService = jasmine.createSpyObj('configurationDataService', {
    findByPropertyName: createSuccessfulRemoteDataObject$(Object.assign(new ConfigurationProperty(), {
      name: 'identifiers.item-status.register-doi',
      values: [
        'true',
      ],
    })),
  });

  const itemPageUrl = `/items/${mockItem.uuid}`;

  const routeStub = {
    parent: {
      data: of({ dso: createSuccessfulRemoteDataObject(mockItem) }),
    },
  };

  let authorizationService: AuthorizationDataService;
  let orcidAuthService: any;

  beforeEach(waitForAsync(() => {
    authorizationService = jasmine.createSpyObj('authorizationService', {
      isAuthorized: of(true),
    });

    orcidAuthService = jasmine.createSpyObj('OrcidAuthService', {
      onlyAdminCanDisconnectProfileFromOrcid: of ( true ),
      isLinkedToOrcid: true,
    });

    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot(), NgbModule, ItemStatusComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: HostWindowService, useValue: new HostWindowServiceStub(0) },
        { provide: AuthorizationDataService, useValue: authorizationService },
        { provide: IdentifierDataService, useValue: mockIdentifierDataService },
        { provide: ConfigurationDataService, useValue: mockConfigurationDataService },
        { provide: OrcidAuthService, useValue: orcidAuthService },
      ], schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatusComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should display the item\'s internal id', () => {
    const statusId: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-id')).nativeElement;
    expect(statusId.textContent).toContain(mockItem.id);
  });

  it('should display the item\'s handle', () => {
    const statusHandle: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-handle')).nativeElement;
    expect(statusHandle.textContent).toContain(mockItem.handle);
  });

  it('should display the item\'s last modified date', () => {
    const statusLastModified: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-lastModified')).nativeElement;
    expect(statusLastModified.textContent).toContain(mockItem.lastModified);
  });

  it('should display the item\'s page url', () => {
    const statusItemPage: HTMLElement = fixture.debugElement.query(By.css('.status-data#status-itemPage')).nativeElement;
    expect(statusItemPage.textContent).toContain(itemPageUrl);
  });

})
;
