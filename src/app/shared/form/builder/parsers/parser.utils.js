import { isNull, isUndefined } from '../../../empty.util';
export function setLayout(model, controlLayout, controlLayoutConfig, style) {
    if (isNull(model.layout)) {
        model.layout = {};
        model.layout[controlLayout] = {};
        model.layout[controlLayout][controlLayoutConfig] = style;
    }
    else if (isUndefined(model.layout[controlLayout])) {
        model.layout[controlLayout] = {};
        model.layout[controlLayout][controlLayoutConfig] = style;
    }
    else if (isUndefined(model.layout[controlLayout][controlLayoutConfig])) {
        model.layout[controlLayout][controlLayoutConfig] = style;
    }
    else {
        model.layout[controlLayout][controlLayoutConfig] = model.layout[controlLayout][controlLayoutConfig].concat(" " + style);
    }
}
//# sourceMappingURL=parser.utils.js.map