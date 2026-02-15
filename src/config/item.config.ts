import { Config } from './config';

export class ItemConfig extends Config {
  @Config.publish() edit: {
    undoTimeout: number;
  };
  // This is used to show the access status label of items in results lists
  @Config.publish() showAccessStatuses: boolean;

  @Config.publish() bitstream: {
    // Number of entries in the bitstream list in the item view page.
    // Rounded to the nearest size in the list of selectable sizes on the
    // settings menu.  See pageSizeOptions in 'pagination-component-options.model.ts'.
    pageSize: number;
    // Show the bitstream access status label
    showAccessStatuses: boolean;
  };
}
