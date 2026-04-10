import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Community } from '@dspace/core/shared/community.model';
import { createSuccessfulRemoteDataObject } from '@dspace/core/utilities/remote-data.utils';
import { of } from 'rxjs';

import { AccessControlFormContainerComponent } from '../../../shared/access-control-form-container/access-control-form-container.component';
import { CommunityAccessControlComponent } from './community-access-control.component';

describe('CommunityAccessControlComponent', () => {
  let component: CommunityAccessControlComponent;
  let fixture: ComponentFixture<CommunityAccessControlComponent>;

  const testCommunity = Object.assign(new Community(),
    {
      type: 'community',
      metadata: {
        'dc.title': [{ value: 'community' }],
      },
      uuid: 'communityUUID',
      parentCommunity: of(Object.assign(createSuccessfulRemoteDataObject(undefined), { statusCode: 204 })),

      _links: {
        parentCommunity: 'site',
        self: '/' + 'communityUUID',
      },
    },
  );

  const routeStub = {
    parent: {
      parent: {
        data: of({
          dso: createSuccessfulRemoteDataObject(testCommunity),
        }),
      },
    },
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityAccessControlComponent],
      providers: [{
        provide: ActivatedRoute, useValue: routeStub,
      }],
    })
      .overrideComponent(CommunityAccessControlComponent, {
        remove: {
          imports: [AccessControlFormContainerComponent],
        },
      })
      .compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityAccessControlComponent);
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
