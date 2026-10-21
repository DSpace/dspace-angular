import { Config } from './config.interface';

/**
 * Type of input rendered for a field of the withdrawal form.
 */
export type WithdrawnFieldType = 'text' | 'url' | 'textarea' | 'boolean';

/**
 * The definition of a metadata field handled when an item is withdrawn.
 *
 * A definition on its own does nothing: it is the `form` and `itemView` lists that decide
 * whether the field is collected on withdrawal, shown on the tombstone page, or both.
 */
export interface WithdrawnFieldConfig extends Config {
  // The metadata field the value is stored in, e.g. dspace.withdrawn.reason
  metadata: string;

  // The kind of input to render, and how the value is rendered on the tombstone page
  type: WithdrawnFieldType;

  // Whether a value must be provided before the item can be withdrawn.
  // On a boolean field it means the checkbox has to be ticked.
  // It is only meaningful for a field listed in `form`
  required: boolean;

  // i18n key of the label shown next to the input, and of the row on the tombstone page
  label: string;

  // Optional i18n key of the hint shown below the input
  hint?: string;
}

/**
 * Configuration of the withdrawal form and of the tombstone page of a withdrawn item.
 *
 * The metadata fields shown on the tombstone page must also be exposed by the REST layer
 * through the `item.withdrawn.publicField` property, otherwise they are not readable by
 * anyone but the administrators.
 */
export interface WithdrawnItemConfig extends Config {
  // Definitions of the metadata fields handled when an item is withdrawn
  fields: WithdrawnFieldConfig[];

  // Metadata fields collected by the withdrawal form, in the order they are rendered.
  // Every entry has to match the `metadata` of a definition in `fields`
  form: string[];

  // Metadata fields shown on the tombstone page of the withdrawn item, in the order they
  // are rendered. Every entry has to match the `metadata` of a definition in `fields`
  itemView: string[];

  // The metadata field holding the URL, or the handle, of the record replacing the item
  replacementField: string;

  // The metadata field holding the flag (true/false) enabling the automatic redirect
  redirectField: string;

  // Whether the tombstone page can be skipped, redirecting to the replacement record
  redirectEnabled: boolean;

  // Whether the administrators of the item are redirected as well. When false they stay
  // on the tombstone page, so that they can still read and fix the item
  redirectAdmins: boolean;

  // The HTTP status code used by the automatic redirect when rendered server side
  redirectStatusCode: number;
}
