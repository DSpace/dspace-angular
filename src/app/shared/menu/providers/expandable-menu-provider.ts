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
    const parentID = uuidv4();

    return combineLatest([
      this.getTopSection(),
      full ? this.getSubSections() : observableOf([]),
    ]).pipe(
      map((
        [partialTopSection, partialSubSections]: [MenuTopSection, MenuSubSection[]]
      ) => {
        const subSections = partialSubSections.map(partialSub => {
          return {
            ...partialSub,
            parentID: parentID,
          };
        });

        return [
          ...subSections,
          {
            ...partialTopSection,
            id: parentID,
            visible: full ? subSections.some(sub => sub.visible) : this.showWithoutSubsections,
          },
        ];
      })
    );
  }
}
