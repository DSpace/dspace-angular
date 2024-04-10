import { Config } from './config.interface';

export interface ItemConfig extends Config {
  edit: {
    undoTimeout: number;
  };
  // This is used to show the access status label of items in results lists
  showAccessStatuses: boolean;

  bitstream: {
    // Number of entries in the bitstream list in the item view page.
    // Rounded to the nearest size in the list of selectable sizes on the
    // settings menu.  See pageSizeOptions in 'pagination-component-options.model.ts'.
    pageSize: number;
  };

  // The maximum number of metadata values to add to the metatag list of the item page
  metatagLimit: number;

  // The maximum number of values for repeatable metadata to show in the full item
  metadataLimit: number;
}
