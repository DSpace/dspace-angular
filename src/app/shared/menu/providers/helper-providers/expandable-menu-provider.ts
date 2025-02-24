/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
import {
  combineLatest,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AbstractMenuProvider,
  PartialMenuSection,
} from '../../menu-provider.model';

/**
 * Helper provider for basic expandable menus
 */
export abstract class AbstractExpandableMenuProvider extends AbstractMenuProvider {

  alwaysRenderExpandable = true;

  /**
   * Get the top section for this expandable menu
   */
  abstract getTopSection(): Observable<PartialMenuSection>;

  /**
   * Get the subsections for this expandable menu
   */
  abstract getSubSections(): Observable<PartialMenuSection[]>;

  /**
   * Retrieve all sections
   * This method will combine both the top section and subsections
   */
  getSections(): Observable<PartialMenuSection[]> {
    return combineLatest([
      this.getTopSection(),
      this.getSubSections(),
    ]).pipe(
      map((
        [partialTopSection, partialSubSections]: [PartialMenuSection, PartialMenuSection[]],
      ) => {
        const parentID = partialTopSection.id ?? this.getAutomatedSectionIdForTopSection();
        const subSections = partialSubSections.map((partialSub, index) => {
          return {
            ...partialSub,
            id: partialSub.id ?? this.getAutomatedSectionIdForSubsection(index),
            parentID: parentID,
            alwaysRenderExpandable: false,
          };
        });

        return [
          ...subSections,
          {
            ...partialTopSection,
            id: parentID,
            alwaysRenderExpandable: this.alwaysRenderExpandable,
          },
        ];
      }),
    );
  }

  protected getAutomatedSectionIdForTopSection(): string {
    return this.getAutomatedSectionId(0);
  }
  protected getAutomatedSectionIdForSubsection(indexOfSubSectionInProvider: number): string {
    return `${this.getAutomatedSectionIdForTopSection()}_${indexOfSubSectionInProvider}`;
  }

}
