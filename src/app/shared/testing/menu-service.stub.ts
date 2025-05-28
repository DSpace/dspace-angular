import {
  Observable,
  of,
} from 'rxjs';

import { MenuID } from '../menu/menu-id.model';
import { MenuSection } from '../menu/menu-section.model';
import { MenuState } from '../menu/menu-state.model';

export class MenuServiceStub {
  visibleSection1 = {
    id: 'section',
    visible: true,
    active: false,
  } as any;
  visibleSection2 = {
    id: 'section_2',
    visible: true,
  } as any;
  hiddenSection3 = {
    id: 'section_3',
    visible: false,
  } as any;
  subSection4 = {
    id: 'section_4',
    visible: true,
    parentID: 'section1',
  } as any;

  toggleMenu(): void { /***/
  }

  expandMenu(): void { /***/
  }

  collapseMenu(): void { /***/
  }

  showMenu(): void { /***/
  }

  hideMenu(): void { /***/
  }

  expandMenuPreview(): void { /***/
  }

  collapseMenuPreview(): void { /***/
  }

  toggleActiveSection(): void { /***/
  }

  activateSection(): void { /***/
  }

  deactivateSection(): void { /***/
  }

  toggleSection(): void { /***/
  }

  addSection(menuID: MenuID, section: MenuSection): void { /***/
  }

  removeSection(): void { /***/
  }

  resetSections(): void { /***/
  }

  isMenuVisible(id: MenuID): Observable<boolean> {
    return of(true);
  }

  isMenuVisibleWithVisibleSections(id: MenuID): Observable<boolean> {
    return of(true);
  }

  isMenuCollapsed(id: MenuID): Observable<boolean> {
    return of(false);
  }

  isMenuPreviewCollapsed(id: MenuID): Observable<boolean> {
    return of(true);
  }

  hasSubSections(id: MenuID, sectionID: string): Observable<boolean> {
    return of(true);
  }

  getMenu(id: MenuID): Observable<MenuState> {  // todo: resolve import
    return of({} as MenuState);
  }

  getMenuTopSections(id: MenuID): Observable<MenuSection[]> {
    return of([this.visibleSection1, this.visibleSection2]);
  }

  getSubSectionsByParentID(id: MenuID): Observable<MenuSection[]> {
    return of([this.subSection4]);
  }

  isSectionActive(id: MenuID, sectionID: string): Observable<boolean> {
    return of(true);
  }

  isSectionVisible(id: MenuID, sectionID: string): Observable<boolean> {
    return of(true);
  }
}
