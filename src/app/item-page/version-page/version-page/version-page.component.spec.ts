import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '@dspace/core/auth/auth.service';
import { VersionDataService } from '@dspace/core/data/version-data.service';
import { Item } from '@dspace/core/shared/item.model';
import { Version } from '@dspace/core/shared/version.model';
import { ActivatedRouteStub } from '@dspace/core/testing/active-router.stub';
import { createPaginatedList } from '@dspace/core/testing/utils.test';
import {
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '@dspace/core/utilities/remote-data.utils';
import { of } from 'rxjs';

import { createRelationshipsObservable } from '../../simple/item-types/shared/item.component.spec';
import { VersionPageComponent } from './version-page.component';

const mockItem: Item = Object.assign(new Item(), {
  bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  metadata: [],
  relationships: createRelationshipsObservable(),
  uuid: 'item-uuid',
});

const mockVersion: Version = Object.assign(new Version(), {
  item: createSuccessfulRemoteDataObject$(mockItem),
  version: 1,
});

@Component({
  template: '',
  standalone: true,
})
class DummyComponent {
}

describe('VersionPageComponent', () => {
  let component: VersionPageComponent;
  let fixture: ComponentFixture<VersionPageComponent>;
  let authService: AuthService;

  const mockRoute = Object.assign(new ActivatedRouteStub(), {
    data: of({ dso: createSuccessfulRemoteDataObject(mockVersion) }),
  });

  beforeEach(waitForAsync(() => {
    authService = jasmine.createSpyObj('authService', {
      isAuthenticated: of(true),
      setRedirectUrl: {},
    });
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'items/item-uuid', component: DummyComponent, pathMatch: 'full' }]), VersionPageComponent, DummyComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: VersionDataService, useValue: {} },
        { provide: AuthService, useValue: authService },
      ],
    }).compileComponents();
  }));



  beforeEach(() => {
    fixture = TestBed.createComponent(VersionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
