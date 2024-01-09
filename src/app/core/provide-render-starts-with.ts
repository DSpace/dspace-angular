import { StartsWithDateComponent } from '../shared/starts-with/date/starts-with-date.component';
import { StartsWithTextComponent } from '../shared/starts-with/text/starts-with-text.component';


/**
 * Declaration needed to make sure all decorator functions are called in time
 */
export const renderStartsWith =
  [
    StartsWithDateComponent,
    StartsWithTextComponent,
  ];
