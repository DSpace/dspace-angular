import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { DSOBreadcrumbsService } from '@dspace/core/breadcrumbs/dso-breadcrumbs.service';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { ChildHALResource } from '@dspace/core/shared/child-hal-resource.model';
import { Context } from '@dspace/core/shared/context.model';
import { DSpaceObject } from '@dspace/core/shared/dspace-object.model';
import { DSpaceObjectType } from '@dspace/core/shared/dspace-object-type.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { SearchResult } from '@dspace/core/shared/search/models/search-result.model';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';
import { TranslateModule } from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  find,
  map,
  shareReplay,
} from 'rxjs/operators';

import { TruncatableService } from '../../truncatable/truncatable.service';
import { TruncatablePartComponent } from '../../truncatable/truncatable-part/truncatable-part.component';
import { SearchResultListElementComponent } from '../search-result-list-element/search-result-list-element.component';

/** Separator used when joining hierarchical breadcrumb labels into a single parent-title string. */
export const BREADCRUMB_SEPARATOR = ' / ';

@Component({
  selector: 'ds-sidebar-search-list-element',
  templateUrl: './sidebar-search-list-element.component.html',
  imports: [
    AsyncPipe,
    NgClass,
    TranslateModule,
    TruncatablePartComponent,
  ],
})
/**
 * Component displaying a list element for a {@link SearchResult} in the sidebar search modal
 * It displays the name of the parent, title and description of the object. All of which are customizable in the child
 * component by overriding the relevant methods of this component
 */
export class SidebarSearchListElementComponent<T extends SearchResult<K>, K extends DSpaceObject> extends SearchResultListElementComponent<T, K> implements OnInit {
  /**
   * Observable for the title of the parent object (displayed above the object's title)
   */
  parentTitle$: Observable<string>;

  /**
   * A description to display below the title
   */
  description: string;

  public constructor(protected truncatableService: TruncatableService,
                     protected linkService: LinkService,
                     public dsoNameService: DSONameService,
                     protected dsoBreadcrumbsService: DSOBreadcrumbsService,
  ) {
    super(truncatableService, dsoNameService, null);
  }

  /**
   * Initialise the component variables
   */
  ngOnInit(): void {
    super.ngOnInit();
    if (hasValue(this.dso)) {
      this.parentTitle$ = this.getParentTitle();
      this.description = this.getDescription();
    }
  }

  /**
   * returns true if this element represents the current dso
   */
  isCurrent(): boolean {
    return this.context === Context.SideBarSearchModalCurrent;
  }

  /**
   * Type guard that narrows a {@link DSpaceObject} to {@link ChildHALResource} & {@link DSpaceObject},
   * which is the signature expected by {@link DSOBreadcrumbsService#getBreadcrumbs}.
   */
  private isChildHALResource(dso: DSpaceObject): dso is ChildHALResource & DSpaceObject {
    return typeof (dso as unknown as ChildHALResource).getParentLinkKey === 'function';
  }

  /**
   * Get the title of the object's parent(s)
   * For communities and collections, show the full hierarchical path excluding the current item
   * For other objects, show just the immediate parent
   */
  getParentTitle(): Observable<string> {
    // Fallback handles cases where type is a raw string rather than a ResourceType instance
    const typeValue = this.dso.type?.value ?? (this.dso as any).type;
    const dso: DSpaceObject = this.dso;
    if (dso && this.isChildHALResource(dso) && (typeValue === DSpaceObjectType.COMMUNITY.toLowerCase() || typeValue === DSpaceObjectType.COLLECTION.toLowerCase())) {
      // For communities and collections, build hierarchical path via breadcrumbs
      return this.dsoBreadcrumbsService.getBreadcrumbs(dso, '').pipe(
        map(breadcrumbs => {
          // Remove the last breadcrumb (current item) and join the rest with ' / '
          const parentBreadcrumbs = breadcrumbs.slice(0, -1);
          return parentBreadcrumbs.length > 0
            ? parentBreadcrumbs.map(crumb => crumb.text).join(BREADCRUMB_SEPARATOR)
            : undefined;
        }),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }

    // For other DSO types, use the simple parent
    return this.getParent().pipe(
      map((parentRD: RemoteData<DSpaceObject>) => {
        return hasValue(parentRD) && hasValue(parentRD.payload) ? this.dsoNameService.getName(parentRD.payload) : undefined;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  /**
   * Get the parent of the object
   */
  getParent(): Observable<RemoteData<DSpaceObject>> {
    if (this.isChildHALResource(this.dso)) {
      const propertyName = this.dso.getParentLinkKey() as string;
      return this.linkService.resolveLink(this.dso, followLink(propertyName))[propertyName].pipe(
        find((parentRD: RemoteData<ChildHALResource & DSpaceObject>) => parentRD.hasSucceeded || parentRD.statusCode === 204),
      );
    }
    return of(undefined);
  }

  /**
   * Get the description of the object
   * Default: "(dc.publisher, dc.date.issued) authors"
   */
  getDescription(): string {
    const publisher = this.firstMetadataValue('dc.publisher');
    const date = this.firstMetadataValue('dc.date.issued');
    const authors = this.allMetadataValues(['dc.contributor.author', 'dc.creator', 'dc.contributor.*']);
    let description = '';
    if (isNotEmpty(publisher) || isNotEmpty(date)) {
      description += '(';
    }
    if (isNotEmpty(publisher)) {
      description += publisher;
    }
    if (isNotEmpty(date)) {
      if (isNotEmpty(publisher)) {
        description += ', ';
      }
      description += date;
    }
    if (isNotEmpty(description)) {
      description += ') ';
    }
    if (isNotEmpty(authors)) {
      authors.forEach((author, i) => {
        description += author;
        if (i < (authors.length - 1)) {
          description += '; ';
        }
      });
    }
    return this.undefinedIfEmpty(description);
  }

  /**
   * Return undefined if the provided string is empty
   * @param value Value to check
   */
  undefinedIfEmpty(value: string) {
    return this.defaultIfEmpty(value, undefined);
  }

  /**
   * Return a default value if the provided string is empty
   * @param value Value to check
   * @param def   Default in case value is empty
   */
  defaultIfEmpty(value: string, def: string) {
    if (isNotEmpty(value)) {
      return value;
    } else {
      return def;
    }
  }
}
