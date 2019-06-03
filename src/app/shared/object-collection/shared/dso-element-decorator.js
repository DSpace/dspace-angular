var dsoElementMap = new Map();
export function renderElementsFor(listable, viewMode) {
    return function decorator(objectElement) {
        if (!objectElement) {
            return;
        }
        if (!dsoElementMap.get(viewMode)) {
            dsoElementMap.set(viewMode, new Map());
        }
        dsoElementMap.get(viewMode).set(listable, objectElement);
    };
}
export function rendersDSOType(listable, viewMode) {
    return dsoElementMap.get(viewMode).get(listable);
}
//# sourceMappingURL=dso-element-decorator.js.map