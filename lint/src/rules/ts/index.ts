import {
  bundle,
  RuleExports,
} from '../../util/structure';
import * as themedComponentUsages from './themed-component-usages';
import * as themedComponentSelectors from './themed-component-selectors';

const index = [
  themedComponentUsages,
  themedComponentSelectors,
] as unknown as RuleExports[];

export = {
  ...bundle('dspace-angular-ts', 'TypeScript',  index),
};
