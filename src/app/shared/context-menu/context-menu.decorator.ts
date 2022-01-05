import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { GenericConstructor } from '../../core/shared/generic-constructor';
import { ContextMenuEntryComponent } from './context-menu-entry.component';

export interface ContextMenuEntryRenderOptions {
  componentRef: GenericConstructor<ContextMenuEntryComponent>;
  isStandAlone: boolean;
}

const contextMenuEntriesMap: Map<DSpaceObjectType, ContextMenuEntryRenderOptions[]> = new Map();

/**
 * Decorator function to link a DSpaceObjectType to a list of context menu entries components
 * @param {DSpaceObjectType} type The DSpaceObjectType
 * @param {boolean} isStandAlone  Represent if menu is a stand alone button
 */
export function rendersContextMenuEntriesForType(type: DSpaceObjectType, isStandAlone: boolean = false) {
  return function decorator(entryComponent: any) {
    if (!entryComponent) {
      return;
    }
    let entryList: any[];
    const renderOptions: ContextMenuEntryRenderOptions = {
      componentRef: entryComponent,
      isStandAlone
    };
    if (contextMenuEntriesMap.has(type)) {
      entryList = [...contextMenuEntriesMap.get(type), renderOptions];
    } else {
      entryList = [renderOptions];
    }
    contextMenuEntriesMap.set(type, entryList);
  };
}

/**
 * Retrieves the list of Component matching a given DSpaceObjectType
 * @param {DSpaceObjectType} type The given DSpaceObjectType
 * @returns {GenericConstructor} The list of constructor of the Components that matches the DSpaceObjectType
 */
export function getContextMenuEntriesForDSOType(type: DSpaceObjectType): ContextMenuEntryRenderOptions[] {
  return contextMenuEntriesMap.get(type);
}
