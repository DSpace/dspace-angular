export enum FieldRendetingType {
  TEXT = 'TEXT',
  HEADING = 'HEADING',
  LONGTEXT = 'LONGTEXT',
  DATE = 'DATE',
  LINK = 'LINK',
  IDENTIFIER = 'IDENTIFIER',
  CRISREF = 'CRISREF'
};

const fieldType = new Map();

export function MetadataBoxFieldRendering(objectType: FieldRendetingType) {
  return function decorator(component: any) {
    if (objectType) {
      fieldType.set(objectType, component);
    }
  }
}

export function getMetadataBoxFieldRendering(objectType: string) {
  return fieldType.get(objectType.toUpperCase());
}
