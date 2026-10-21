import { WithdrawnFieldConfig } from '@dspace/config/withdrawn-item-config.interface';
import {
  hasValue,
  isNotEmpty,
} from '@dspace/shared/utils/empty.util';

/**
 * The metadata values accepted as a positive boolean flag.
 */
const TRUE_VALUES = ['true', 'yes', '1'];

/**
 * Whether the given metadata value has to be read as a positive boolean flag.
 *
 * @param value the metadata value
 */
export function isTrueValue(value: string): boolean {
  return isNotEmpty(value) && TRUE_VALUES.includes(value.trim().toLowerCase());
}

/**
 * Whether the given value is an absolute http(s) url, which is the only kind of
 * destination accepted for a redirect or for a link rendered on the tombstone page.
 * Anything else, a javascript: url in particular, is rejected.
 *
 * @param value the value to check
 */
export function isAbsoluteUrl(value: string): boolean {
  if (!isNotEmpty(value)) {
    return false;
  }
  return /^https?:\/\/\S+$/i.test(value.trim());
}

/**
 * Resolves a list of metadata fields against the available definitions, keeping the order
 * of the list and dropping the entries which have no definition, so that a typo in the
 * configuration leaves a field out instead of breaking the page.
 *
 * @param metadataFields the metadata fields to resolve, e.g. item.withdrawn.form
 * @param definitions    the available field definitions, i.e. item.withdrawn.fields
 */
export function resolveWithdrawnFields(metadataFields: string[],
  definitions: WithdrawnFieldConfig[]): WithdrawnFieldConfig[] {

  return (metadataFields || [])
    .map((metadata: string) => (definitions || []).find((field) => field.metadata === metadata))
    .filter((field: WithdrawnFieldConfig) => hasValue(field));
}
