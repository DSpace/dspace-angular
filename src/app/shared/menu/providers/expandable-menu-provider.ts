/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import { Omit } from '@material-ui/core';
import {
  combineLatest,
  Observable,
  of as observableOf,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../menu-provider';
import { Type } from '@angular/core';

export type MenuTopSection = Omit<PartialMenuSection, 'visible'>;
export type MenuSubSection = Omit<PartialMenuSection, 'parentID'>;

export abstract class AbstractExpandableMenuProvider extends AbstractMenuProvider {
  protected showWithoutSubsections = false;

  abstract getTopSection(): Observable<MenuTopSection>;

  abstract getSubSections(): Observable<MenuSubSection[]>;

  protected includeSubSections(): boolean {
    return true;
  }

  getSections(): Observable<PartialMenuSection[]> {
    const full = this.includeSubSections();

    return combineLatest([
      this.getTopSection(),
      full ? this.getSubSections() : observableOf([]),
    ]).pipe(
      map((
        [partialTopSection, partialSubSections]: [MenuTopSection, MenuSubSection[]]
      ) => {
        const subSections = partialSubSections.map((partialSub, index) => {
          return {
            ...partialSub,
            id: partialSub.id ?? `${this.menuProviderId}_Sub-${index}`,
            parentID: this.menuProviderId,
          };
        });

        return [
          ...subSections,
          {
            ...partialTopSection,
            id: this.menuProviderId,
            visible: full ? subSections.some(sub => sub.visible) : this.showWithoutSubsections,
          },
        ];
      })
    );
  }
}
