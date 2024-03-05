import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionAccessControlComponent } from './collection-access-control.component';
import { ActivatedRoute } from '@angular/router';
import { of, of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject } from '../../../shared/remote-data.utils';
import { Community } from '../../../core/shared/community.model';

describe('CollectionAccessControlComponent', () => {
  let component: CollectionAccessControlComponent;
  let fixture: ComponentFixture<CollectionAccessControlComponent>;
  const testCommunity = Object.assign(new Community(),
    {
      type: 'community',
      metadata: {
        'dc.title': [{ value: 'community' }]
      },
      uuid: 'communityUUID',
      parentCommunity: observableOf(Object.assign(createSuccessfulRemoteDataObject(undefined), { statusCode: 204 })),

      _links: {
        parentCommunity: 'site',
        self: '/' + 'communityUUID'
      }
    }
  );

  const routeStub = {
    parent: {
     parent: {
       data: of({
         dso: createSuccessfulRemoteDataObject(testCommunity)
       })
     }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionAccessControlComponent ],
      providers: [{ provide: ActivatedRoute, useValue: routeStub }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionAccessControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set itemRD$', (done) => {
    component.itemRD$.subscribe(result => {
      expect(result).toEqual(createSuccessfulRemoteDataObject(testCommunity));
      done();
    });
  });
});
