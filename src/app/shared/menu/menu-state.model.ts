import { MenuID } from './menu-id.model';
import { MenuSectionIndex } from './menu-section-Index.model';
import { MenuSections } from './menu-sections.model';

/**
 * Represents the state of a single menu in the store
 */
export interface MenuState {
  id: MenuID;
  collapsed: boolean;
  previewCollapsed: boolean;
  visible: boolean;
  sections: MenuSections;
  sectionToSubsectionIndex: MenuSectionIndex;
}
