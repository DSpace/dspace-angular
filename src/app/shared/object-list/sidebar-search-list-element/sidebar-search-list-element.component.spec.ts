import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '@dspace/core';
import { LinkService } from '@dspace/core';
import { ChildHALResource } from '@dspace/core';
import { DSpaceObject } from '@dspace/core';
import { HALResource } from '@dspace/core';
import { SearchResult } from '@dspace/core';
import { createSuccessfulRemoteDataObject$ } from '@dspace/core';
import { mockTruncatableService } from '../../mocks/mock-trucatable.service';
import { TruncatableService } from '../../truncatable/truncatable.service';
import { VarDirective } from '../../utils/var.directive';

export function createSidebarSearchListElementTests(
  componentClass: any,
  object: SearchResult<DSpaceObject & ChildHALResource>,
  parent: DSpaceObject,
  expectedParentTitle: string,
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

    it('should contain the correct parent title', (done) => {
      component.parentTitle$.subscribe((title) => {
        expect(title).toEqual(expectedParentTitle);
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
