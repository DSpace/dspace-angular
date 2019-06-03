var menuMenuItemComponentMap = new Map();
/**
 * Decorator function to link a MenuItemType to a Component
 * @param {MenuItemType} type The MenuItemType of the MenuSection's model
 * @returns {(sectionComponent: GenericContructor) => void}
 */
export function rendersMenuItemForType(type) {
    return function decorator(sectionComponent) {
        if (!sectionComponent) {
            return;
        }
        menuMenuItemComponentMap.set(type, sectionComponent);
    };
}
/**
 * Retrieves the Component matching a given MenuItemType
 * @param {MenuItemType} type The given MenuItemType
 * @returns {GenericConstructor} The constructor of the Component that matches the MenuItemType
 */
export function getComponentForMenuItemType(type) {
    return menuMenuItemComponentMap.get(type);
}
//# sourceMappingURL=menu-item.decorator.js.map