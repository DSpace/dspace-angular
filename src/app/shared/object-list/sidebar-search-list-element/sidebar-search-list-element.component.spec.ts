import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { RemoteData } from 'src/app/core/data/remote-data';
import { Collection } from 'src/app/core/shared/collection.model';
import { Community } from 'src/app/core/shared/community.model';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../core/cache/builders/link.service';
import { ChildHALResource } from '../../../core/shared/child-hal-resource.model';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { HALResource } from '../../../core/shared/hal-resource.model';
import { mockTruncatableService } from '../../mocks/mock-trucatable.service';
import { createSuccessfulRemoteDataObject$ } from '../../remote-data.utils';
import { SearchResult } from '../../search/models/search-result.model';
import { TruncatableService } from '../../truncatable/truncatable.service';
import { VarDirective } from '../../utils/var.directive';

export function createSidebarSearchListElementTests(
  componentClass: any,
  object: SearchResult<DSpaceObject & ChildHALResource>,
  parent: DSpaceObject,
  expectedHierarchicalTitle: string,
  expectedTitle: string,
  expectedDescription: string,
  extraProviders: any[] = [],
) {
  return () => {
    let component;
    let fixture: ComponentFixture<any>;

    let linkService;

    beforeEach(waitForAsync(() => {
      linkService = jasmine.createSpyObj('linkService', {
        resolveLink: Object.assign(new HALResource(), {
          [object.indexableObject.getParentLinkKey()]: createSuccessfulRemoteDataObject$(parent),
        }),
      });
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([]), VarDirective],
        providers: [
          { provide: TruncatableService, useValue: mockTruncatableService },
          { provide: LinkService, useValue: linkService },
          DSONameService,
          ...extraProviders,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    }));

    beforeEach(() => {
      fixture = TestBed.createComponent(componentClass);
      component = fixture.componentInstance;
      component.object = object;
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should contain the correct hierarchical title', (done) => {
      component.hierarchicalTitle$.subscribe((title) => {
        expect(title).toEqual(expectedHierarchicalTitle);
        done();
      });
    });

    it('should contain the correct title', () => {
      expect(component.dsoTitle).toEqual(expectedTitle);
    });

    it('should contain the correct description', () => {
      expect(component.description).toEqual(expectedDescription);
    });
  };
}

export function getExpectedHierarchicalTitle(parentObj: Collection | Community, obj: SearchResult<DSpaceObject>): Observable<string> {
  let titles: string[] = [];
  if (obj.indexableObject.metadata['dc.title']) {
    titles = [obj.indexableObject.metadata['dc.title'][0].value];
  }
  let currentParent = parentObj;

  const fetchParentTitles = (currParent: Collection | Community): Observable<string[]> => {
    if (!currParent) {
      return of([]);
    }

    if (currParent.parentCommunity) {
      return currParent.parentCommunity.pipe(
        switchMap((remoteData: RemoteData<Community>) => {
          if (remoteData.hasSucceeded && remoteData.payload) {
            const parentTitle = remoteData.payload.name;
            titles.unshift(parentTitle);
            return fetchParentTitles(remoteData.payload);
          }
          return of([]);
        }),
        catchError(() => of([])),
      );
    } else {
      return of([]);
    }
  };

  return fetchParentTitles(currentParent).pipe(
    switchMap(() => titles.join(' > ')),
  );
}
