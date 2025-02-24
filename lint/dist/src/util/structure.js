"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundle = void 0;
function bundle(name, language, index) {
    return index.reduce((o, i) => {
        o.rules[i.info.name] = i.rule;
        return o;
    }, {
        name,
        language,
        rules: {},
        index,
    });
}
exports.bundle = bundle;
//# sourceMappingURL=structure.js.map