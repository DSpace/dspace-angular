import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';

import { Collection } from '../../../core/shared/collection.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { ResourcePoliciesComponent } from '../../../shared/resource-policies/resource-policies.component';
import { CollectionAuthorizationsComponent } from './collection-authorizations.component';

describe('CollectionAuthorizationsComponent', () => {
  let comp: CollectionAuthorizationsComponent<DSpaceObject>;
  let fixture: ComponentFixture<CollectionAuthorizationsComponent<any>>;

  const collection = Object.assign(new Collection(), {
    uuid: 'collection',
    id: 'collection',
    _links: {
      self: { href: 'collection-selflink' },
    },
  });

  const collectionRD = createSuccessfulRemoteDataObject(collection);

  const routeStub = {
    parent: {
      parent: {
        data: of({
          dso: collectionRD,
        }),
      },
    },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        CollectionAuthorizationsComponent,
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        ChangeDetectorRef,
        CollectionAuthorizationsComponent,
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .overrideComponent(CollectionAuthorizationsComponent, {
        remove: { imports: [ResourcePoliciesComponent] },
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAuthorizationsComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    comp = null;
    fixture.destroy();
  });

  it('should create', () => {
    expect(comp).toBeTruthy();
  });

  it('should init dso remote data properly', (done) => {
    const expected = cold('(a|)', { a: collectionRD });
    expect(comp.dsoRD$).toBeObservable(expected);
    done();
  });
});
