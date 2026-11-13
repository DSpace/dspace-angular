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
import * as noMethodCallWithAsyncPipe from './no-method-call-with-async-pipe';
import * as themedComponentUsages from './themed-component-usages';

const index = [
  themedComponentUsages,
  noDisabledAttributeOnButton,
  noMethodCallWithAsyncPipe,

] as unknown as RuleExports[];

export = {
  parser: import('@angular-eslint/template-parser'),
  ...bundle('dspace-angular-html', 'HTML', index),
};
