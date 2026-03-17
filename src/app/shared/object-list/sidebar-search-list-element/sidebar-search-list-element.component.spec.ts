import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APP_CONFIG } from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { ChildHALResource } from '@dspace/core/shared/child-hal-resource.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { HALResource } from '@dspace/core/shared/hal-resource.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import { mockTruncatableService } from '@dspace/core/testing/mock-trucatable.service';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { TranslateModule } from '@ngx-translate/core';

import { TruncatableService } from '../../truncatable/truncatable.service';
import { TruncatablePartComponent } from '../../truncatable/truncatable-part/truncatable-part.component';
import { VarDirective } from '../../utils/var.directive';
import { DSOBreadcrumbsService } from '@dspace/core/breadcrumbs/dso-breadcrumbs.service';
import { Breadcrumb } from '@dspace/core/breadcrumbs/models/breadcrumb.model';
import { ResourceType } from '@dspace/core/shared/resource-type';
import { createNoContentRemoteDataObject$ } from '@dspace/core/utilities/remote-data.utils';
import { of as observableOf } from 'rxjs';
import { BREADCRUMB_SEPARATOR } from './sidebar-search-list-element.component';

export function createSidebarSearchListElementTests(
  componentClass: any,
  object: SearchResult<DSpaceObject & ChildHALResource>,
  parent: DSpaceObject,
  expectedParentTitle: string,
  expectedTitle: string,
  expectedDescription: string,
  extraProviders: any[] = [],
  assertBreadcrumbsUsed = false
) {
  return () => {
    let component;
    let fixture: ComponentFixture<any>;

    let linkService;
    let dsoBreadcrumbsService;

    const environment = {
      browseBy: {
        showThumbnails: true,
      },
    };

    beforeEach(waitForAsync(() => {
      // Propagate the class-level static ResourceType onto the instance so that
      // the community/collection branch in getParentTitle() is reached correctly.
      const staticType: ResourceType | undefined = (object.indexableObject.constructor as any).type;
      if (staticType) {
        (object.indexableObject as any).type = staticType;
      }

      linkService = jasmine.createSpyObj('linkService', {
        resolveLink: Object.assign(new HALResource(), {
          [object.indexableObject.getParentLinkKey()]: createSuccessfulRemoteDataObject$(parent),
        }),
      });
      const breadcrumbs: Breadcrumb[] = [];
      if (expectedParentTitle) {
        breadcrumbs.push(new Breadcrumb(expectedParentTitle, ''));
      }
      breadcrumbs.push(new Breadcrumb(expectedTitle, ''));
      dsoBreadcrumbsService = jasmine.createSpyObj('dsoBreadcrumbsService', {
        getBreadcrumbs: observableOf(breadcrumbs)
      });
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), VarDirective],
        providers: [
          { provide: TruncatableService, useValue: mockTruncatableService },
          { provide: LinkService, useValue: linkService },
          { provide: APP_CONFIG, useValue: environment },
          { provide: DSOBreadcrumbsService, useValue: dsoBreadcrumbsService },
          DSONameService,
          ...extraProviders,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).overrideComponent(componentClass, { remove: { imports: [TruncatablePartComponent] } }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(componentClass);
      component = fixture.componentInstance;
      component.object = object;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should contain the correct parent title', (done) => {
      component.parentTitle$.subscribe((title) => {
        expect(title).toEqual(expectedParentTitle);
        done();
      });
    });

    if (assertBreadcrumbsUsed) {
      it('should delegate to DSOBreadcrumbsService.getBreadcrumbs to resolve the parent title', (done) => {
        component.parentTitle$.subscribe(() => {
          expect(dsoBreadcrumbsService.getBreadcrumbs).toHaveBeenCalledWith(
            object.indexableObject,
            ''
          );
          done();
        });
      });
    }

    it('should contain the correct title', () => {
      expect(component.dsoTitle).toEqual(expectedTitle);
    });

    it('should contain the correct description', () => {
      expect(component.description).toEqual(expectedDescription);
    });
  };
}

/**
 * Shared test suite that verifies the hierarchical parent-path behaviour for community/collection
 * list elements: when the DSO has multiple ancestor breadcrumbs the component must join them with
 * {@link BREADCRUMB_SEPARATOR} and must delegate to {@link DSOBreadcrumbsService#getBreadcrumbs} rather than the simple
 * parent link.
 *
 * @param componentClass  The component under test (community or collection sidebar element)
 * @param object          A {@link SearchResult} whose `indexableObject` is a Community/Collection
 * @param expectedTitle   The dc.title of the current item (last breadcrumb)
 * @param extraProviders  Any additional providers required by the component
 */
export function createHierarchicalParentTitleTests(
  componentClass: any,
  object: SearchResult<DSpaceObject & ChildHALResource>,
  expectedTitle: string,
  extraProviders: any[] = []
) {
  return () => {
    let component;
    let fixture: ComponentFixture<any>;
    let dsoBreadcrumbsService;

    // Three-level hierarchy:  Root → Parent → Current
    const rootBreadcrumb   = new Breadcrumb('Root',    '');
    const parentBreadcrumb = new Breadcrumb('Parent',  '');
    const currentBreadcrumb = new Breadcrumb(expectedTitle, '');
    const breadcrumbs = [rootBreadcrumb, parentBreadcrumb, currentBreadcrumb];

    beforeEach(waitForAsync(() => {
      // Propagate the class-level static ResourceType onto the instance so that
      // the community/collection branch in getParentTitle() is reached correctly.
      const staticType: ResourceType | undefined = (object.indexableObject.constructor as any).type;
      if (staticType) {
        (object.indexableObject as any).type = staticType;
      }

      // Set up the linkService with a safe RemoteData observable for the parent link so that
      // even if the type-check guard ever regresses, the fallback getParent() path resolves
      // cleanly via the find() predicate (statusCode === 204) without a TypeError.
      const parentLinkKey = (object.indexableObject as ChildHALResource).getParentLinkKey() as string;
      const linkService = jasmine.createSpyObj('linkService', {
        resolveLink: Object.assign(new HALResource(), {
          [parentLinkKey]: createNoContentRemoteDataObject$()
        })
      });
      dsoBreadcrumbsService = jasmine.createSpyObj('dsoBreadcrumbsService', {
        getBreadcrumbs: observableOf(breadcrumbs)
      });

      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), VarDirective],
        providers: [
          { provide: TruncatableService, useValue: {} },
          { provide: LinkService, useValue: linkService },
          { provide: DSOBreadcrumbsService, useValue: dsoBreadcrumbsService },
          DSONameService,
          ...extraProviders,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).overrideComponent(componentClass, { remove: { imports: [TruncatablePartComponent] } }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(componentClass);
      component = fixture.componentInstance;
      component.object = object;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should join multiple ancestor breadcrumbs with BREADCRUMB_SEPARATOR as the parent title', (done) => {
      component.parentTitle$.subscribe((title) => {
        expect(title).toEqual(['Root', 'Parent'].join(BREADCRUMB_SEPARATOR));
        done();
      });
    });

    it('should call DSOBreadcrumbsService.getBreadcrumbs to build the hierarchy path', (done) => {
      component.parentTitle$.subscribe(() => {
        expect(dsoBreadcrumbsService.getBreadcrumbs).toHaveBeenCalledWith(
          object.indexableObject,
          ''
        );
        done();
      });
    });
  };
}
