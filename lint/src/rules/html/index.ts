/**
 * The contents of this file are subject to the license and copyright
 * detailed in the LICENSE and NOTICE files at the root of the source
 * tree and available online at
 *
 * http://www.dspace.org/license/
 */
/* eslint-disable import/no-namespace */
import {
  bundle,
  RuleExports,
} from '../../util/structure';
import * as noDisabledAttributeOnButton from './no-disabled-attribute-on-button';
import * as themedComponentUsages from './themed-component-usages';

const index = [
  themedComponentUsages,
  noDisabledAttributeOnButton,

] as unknown as RuleExports[];

export = {
  parser: require('@angular-eslint/template-parser'),
  ...bundle('dspace-angular-html', 'HTML', index),
};
