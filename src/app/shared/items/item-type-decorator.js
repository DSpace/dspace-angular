import { hasNoValue, hasValue } from '../empty.util';
import { MetadataRepresentationType } from '../../core/shared/metadata-representation/metadata-representation.model';
export var ItemViewMode;
(function (ItemViewMode) {
    ItemViewMode["Element"] = "element";
    ItemViewMode["Full"] = "full";
    ItemViewMode["Metadata"] = "metadata";
})(ItemViewMode || (ItemViewMode = {}));
export var DEFAULT_ITEM_TYPE = 'Default';
export var DEFAULT_VIEW_MODE = ItemViewMode.Element;
export var NO_REPRESENTATION_TYPE = MetadataRepresentationType.None;
export var DEFAULT_REPRESENTATION_TYPE = MetadataRepresentationType.PlainText;
var map = new Map();
/**
 * Decorator used for rendering simple item pages by type and viewMode (and optionally a representationType)
 * @param type
 * @param viewMode
 * @param representationType
 */
export function rendersItemType(type, viewMode, representationType) {
    return function decorator(component) {
        if (hasNoValue(map.get(viewMode))) {
            map.set(viewMode, new Map());
        }
        if (hasNoValue(map.get(viewMode).get(type))) {
            map.get(viewMode).set(type, new Map());
        }
        if (hasNoValue(representationType)) {
            representationType = NO_REPRESENTATION_TYPE;
        }
        if (hasValue(map.get(viewMode).get(type).get(representationType))) {
            throw new Error("There can't be more than one component to render Metadata of type \"" + type + "\" in view mode \"" + viewMode + "\" with representation type \"" + representationType + "\"");
        }
        map.get(viewMode).get(type).set(representationType, component);
    };
}
/**
 * Get the component used for rendering an item by type and viewMode (and optionally a representationType)
 * @param type
 * @param viewMode
 * @param representationType
 */
export function getComponentByItemType(type, viewMode, representationType) {
    if (hasNoValue(representationType)) {
        representationType = NO_REPRESENTATION_TYPE;
    }
    if (hasNoValue(map.get(viewMode))) {
        viewMode = DEFAULT_VIEW_MODE;
    }
    if (hasNoValue(map.get(viewMode).get(type))) {
        type = DEFAULT_ITEM_TYPE;
    }
    var representationComponent = map.get(viewMode).get(type).get(representationType);
    if (hasNoValue(representationComponent)) {
        representationComponent = map.get(viewMode).get(type).get(DEFAULT_REPRESENTATION_TYPE);
    }
    if (hasNoValue(representationComponent)) {
        representationComponent = map.get(viewMode).get(type).get(NO_REPRESENTATION_TYPE);
    }
    return representationComponent;
}
//# sourceMappingURL=item-type-decorator.js.map