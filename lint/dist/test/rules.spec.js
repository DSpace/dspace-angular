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
const html_1 = __importDefault(require("../src/rules/html"));
const ts_1 = __importDefault(require("../src/rules/ts"));
const testing_1 = require("./testing");
describe('TypeScript rules', () => {
    for (const { info, rule, tests } of ts_1.default.index) {
        testing_1.tsRuleTester.run(info.name, rule, tests);
    }
});
describe('HTML rules', () => {
    for (const { info, rule, tests } of html_1.default.index) {
        testing_1.htmlRuleTester.run(info.name, rule, tests);
    }
});
//# sourceMappingURL=rules.spec.js.map