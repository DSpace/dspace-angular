import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, Component, Injector, NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { cold, getTestScheduler } from 'jasmine-marbles';
import { of as observableOf } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { TranslateModule } from '@ngx-translate/core';

import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject
} from '../../remote-data.utils';
import { createTestComponent } from '../../testing/utils.test';
import { ResourcePolicyCreateComponent } from './resource-policy-create.component';
import { LinkService } from '../../../core/cache/builders/link.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { ResourcePolicyService } from '../../../core/resource-policy/resource-policy.service';
import { getMockResourcePolicyService } from '../../mocks/mock-resource-policy-service';
import { getMockLinkService } from '../../mocks/link-service.mock';
import { RouterStub } from '../../testing/router.stub';
import { Item } from '../../../core/shared/item.model';
import { createMockRDPaginatedObs } from '../../../+item-page/edit-item-page/item-bitstreams/item-bitstreams.component.spec';
import { ResourcePolicyEvent } from '../form/resource-policy-form.component';
import { GroupMock } from '../../testing/group-mock';
import { submittedResourcePolicy } from '../form/resource-policy-form.component.spec';
import { PolicyType } from '../../../core/resource-policy/models/policy-type.model';
import { ActionType } from '../../../core/resource-policy/models/action-type.model';
import { EPersonMock } from '../../testing/eperson.mock';

describe('ResourcePolicyCreateComponent test suite', () => {
  let comp: ResourcePolicyCreateComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<ResourcePolicyCreateComponent>;
  let de;
  let scheduler: TestScheduler;
  let eventPayload: ResourcePolicyEvent;

  const resourcePolicy: any = {
    id: '1',
    name: null,
    description: null,
    policyType: PolicyType.TYPE_SUBMISSION,
    action: ActionType.READ,
    startDate: null,
    endDate: null,
    type: 'resourcepolicy',
    uuid: 'resource-policy-1',
    _links: {
      eperson: {
        href: 'https://rest.api/rest/api/eperson'
      },
      group: {
        href: 'https://rest.api/rest/api/group'
      },
      self: {
        href: 'https://rest.api/rest/api/resourcepolicies/1'
      },
    },
    eperson: observableOf(createSuccessfulRemoteDataObject({})),
    group: observableOf(createSuccessfulRemoteDataObject(GroupMock))
  };

  const item = Object.assign(new Item(), {
    uuid: 'itemUUID',
    id: 'itemUUID',
    metadata: {
      'dc.title': [{
        value: 'test item'
      }]
    },
    _links: {
      self: { href: 'item-selflink' }
    },
    bundles: createMockRDPaginatedObs([])
  });

  const resourcePolicyService: any = getMockResourcePolicyService();
  const linkService: any = getMockLinkService();
  const routeStub = {
    data: observableOf({
      resourcePolicyTarget: createSuccessfulRemoteDataObject(item)
    })
  };
  const routerStub = Object.assign(new RouterStub(), {
    url: `url/edit`
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      declarations: [
        ResourcePolicyCreateComponent,
        TestComponent
      ],
      providers: [
        { provide: LinkService, useValue: linkService },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ResourcePolicyService, useValue: resourcePolicyService },
        { provide: Router, useValue: routerStub },
        ResourcePolicyCreateComponent,
        ChangeDetectorRef,
        Injector
      ],
      schemas: [
        NO_ERRORS_SCHEMA
      ]
    }).compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-resource-policy-create></ds-resource-policy-create>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create ResourcePolicyCreateComponent', inject([ResourcePolicyCreateComponent], (app: ResourcePolicyCreateComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {

    beforeEach(() => {
      // initTestScheduler();
      fixture = TestBed.createComponent(ResourcePolicyCreateComponent);
      comp = fixture.componentInstance;
      compAsAny = fixture.componentInstance;
    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      de = null;
      fixture.destroy();
    });

    it('should init component properly', () => {
      fixture.detectChanges();
      expect(compAsAny.targetResourceUUID).toBe('itemUUID');
      expect(compAsAny.targetResourceName).toBe('test item');
    });

    it('should redirect to authorizations page', () => {
      comp.redirectToAuthorizationsPage();
      expect(compAsAny.router.navigate).toHaveBeenCalled();
    });

    it('should return true when is Processing', () => {
      compAsAny.processing$.next(true);
      expect(comp.isProcessing()).toBeObservable(cold('a', {
        a: true
      }));
    });

    it('should return false when is not Processing', () => {
      compAsAny.processing$.next(false);
      expect(comp.isProcessing()).toBeObservable(cold('a', {
        a: false
      }));
    });

    describe('when target type is group', () => {
      beforeEach(() => {
        spyOn(comp, 'redirectToAuthorizationsPage').and.callThrough();

        compAsAny.targetResourceUUID = 'itemUUID';

        eventPayload = Object.create({});
        eventPayload.object = submittedResourcePolicy;
        eventPayload.target = {
          type: 'group',
          uuid: GroupMock.id
        };
      });

      it('should notify success when creation is successful', () => {
        compAsAny.resourcePolicyService.create.and.returnValue(observableOf(createSuccessfulRemoteDataObject(resourcePolicy)));

        scheduler = getTestScheduler();
        scheduler.schedule(() => comp.createResourcePolicy(eventPayload));
        scheduler.flush();

        expect(compAsAny.resourcePolicyService.create).toHaveBeenCalledWith(eventPayload.object, 'itemUUID', null, eventPayload.target.uuid);
        expect(comp.redirectToAuthorizationsPage).toHaveBeenCalled();
      });

      it('should notify error when creation is not successful', () => {
        compAsAny.resourcePolicyService.create.and.returnValue(observableOf(createFailedRemoteDataObject({})));

        scheduler = getTestScheduler();
        scheduler.schedule(() => comp.createResourcePolicy(eventPayload));
        scheduler.flush();

        expect(compAsAny.resourcePolicyService.create).toHaveBeenCalledWith(eventPayload.object, 'itemUUID', null, eventPayload.target.uuid);
        expect(comp.redirectToAuthorizationsPage).not.toHaveBeenCalled();
      });
    });

    describe('when target type of created policy is eperson', () => {

      beforeEach(() => {
        spyOn(comp, 'redirectToAuthorizationsPage').and.callThrough();

        compAsAny.targetResourceUUID = 'itemUUID';

        eventPayload = Object.create({});
        eventPayload.object = submittedResourcePolicy;
        eventPayload.target = {
          type: 'eperson',
          uuid: EPersonMock.id
        };
      });

      it('should notify success when creation is successful', () => {
        compAsAny.resourcePolicyService.create.and.returnValue(observableOf(createSuccessfulRemoteDataObject(resourcePolicy)));

        scheduler = getTestScheduler();
        scheduler.schedule(() => comp.createResourcePolicy(eventPayload));
        scheduler.flush();

        expect(compAsAny.resourcePolicyService.create).toHaveBeenCalledWith(eventPayload.object, 'itemUUID', eventPayload.target.uuid);
        expect(comp.redirectToAuthorizationsPage).toHaveBeenCalled();
      });

      it('should notify error when creation is not successful', () => {
        compAsAny.resourcePolicyService.create.and.returnValue(observableOf(createFailedRemoteDataObject({})));

        scheduler = getTestScheduler();
        scheduler.schedule(() => comp.createResourcePolicy(eventPayload));
        scheduler.flush();

        expect(compAsAny.resourcePolicyService.create).toHaveBeenCalledWith(eventPayload.object, 'itemUUID', eventPayload.target.uuid);
        expect(comp.redirectToAuthorizationsPage).not.toHaveBeenCalled();
      });
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``
})
class TestComponent {

}
