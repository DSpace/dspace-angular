"use strict";
/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const html_1 = __importDefault(require("./src/rules/html"));
const ts_1 = __importDefault(require("./src/rules/ts"));
const templates = new Map();
function lazyEJS(path, data) {
    if (!templates.has(path)) {
        templates.set(path, require('ejs').compile((0, fs_1.readFileSync)(path).toString()));
    }
    return templates.get(path)(data).replace(/\r\n/g, '\n');
}
const docsDir = (0, path_1.join)('docs', 'lint');
const tsDir = (0, path_1.join)(docsDir, 'ts');
const htmlDir = (0, path_1.join)(docsDir, 'html');
if ((0, fs_1.existsSync)(docsDir)) {
    (0, fs_1.rmSync)(docsDir, { recursive: true });
}
(0, fs_1.mkdirSync)((0, path_1.join)(tsDir, 'rules'), { recursive: true });
(0, fs_1.mkdirSync)((0, path_1.join)(htmlDir, 'rules'), { recursive: true });
function template(name) {
    return (0, path_1.join)('lint', 'src', 'util', 'templates', name);
}
// TypeScript docs
(0, fs_1.writeFileSync)((0, path_1.join)(tsDir, 'index.md'), lazyEJS(template('index.ejs'), {
    plugin: ts_1.default,
    rules: ts_1.default.index.map(rule => rule.info),
}));
for (const rule of ts_1.default.index) {
    (0, fs_1.writeFileSync)((0, path_1.join)(tsDir, 'rules', rule.info.name + '.md'), lazyEJS(template('rule.ejs'), {
        plugin: ts_1.default,
        rule: rule.info,
        tests: rule.tests,
    }));
}
// HTML docs
(0, fs_1.writeFileSync)((0, path_1.join)(htmlDir, 'index.md'), lazyEJS(template('index.ejs'), {
    plugin: html_1.default,
    rules: html_1.default.index.map(rule => rule.info),
}));
for (const rule of html_1.default.index) {
    (0, fs_1.writeFileSync)((0, path_1.join)(htmlDir, 'rules', rule.info.name + '.md'), lazyEJS(template('rule.ejs'), {
        plugin: html_1.default,
        rule: rule.info,
        tests: rule.tests,
    }));
}
//# sourceMappingURL=generate-docs.js.map