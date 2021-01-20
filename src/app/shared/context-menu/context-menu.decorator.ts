import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';

const contextMenuEntriesMap: Map<DSpaceObjectType, any[]> = new Map();

/**
 * Decorator function to link a DSpaceObjectType to a list of context menu entries components
 * @param {DSpaceObjectType} type The DSpaceObjectType
 * @returns {(entryComponent: GenericContructor) => void}
 */
export function rendersContextMenuEntriesForType(type: DSpaceObjectType) {
  return function decorator(entryComponent: any) {
    if (!entryComponent) {
      return;
    }
    let entryList: any[];
    if (contextMenuEntriesMap.has(type)) {
      entryList = [...contextMenuEntriesMap.get(type), entryComponent]
    } else {
      entryList = [entryComponent]
    }
    contextMenuEntriesMap.set(type, entryList);
  };
}

/**
 * Retrieves the list of Component matching a given DSpaceObjectType
 * @param {DSpaceObjectType} type The given DSpaceObjectType
 * @returns {GenericConstructor} The list of constructor of the Components that matches the DSpaceObjectType
 */
export function getContextMenuEntriesForDSOType(type: DSpaceObjectType): any[] {
  return contextMenuEntriesMap.get(type);
}
