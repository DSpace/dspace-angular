/** A map of metadata keys to an ordered list of MetadataValue objects. */
export interface MetadataMap {
  [ key: string ]: MetadataValue[];
}

/** A single metadata value and its properties. */
export interface MetadataValue {

  /** The language. */
  language: string;

  /** The string value. */
  value: string;
}

/** Constraints for matching metadata values. */
export interface MetadataValueFilter {

  /** The language constraint. */
  language?: string;

  /** The value constraint. */
  value?: string;

  /** Whether the value constraint should match without regard to case. */
  ignoreCase?: boolean;

  /** Whether the value constraint should match as a substring. */
  substring?: boolean;
}
