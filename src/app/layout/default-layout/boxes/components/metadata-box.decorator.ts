export enum FieldRenderingType {
  TEXT = 'TEXT',
  HEADING = 'HEADING',
  LONGTEXT = 'LONGTEXT',
  DATE = 'DATE',
  LINK = 'LINK',
  IDENTIFIER = 'IDENTIFIER',
  CRISREF = 'CRISREF',
  THUMBNAIL = 'THUMBNAIL',
  ATTACHMENT = 'ATTACHMENT',
  TABLE = 'TABLE',
  INLINE = 'INLINE',
  ORCID = 'ORCID',
}

const fieldType = new Map();

export function MetadataBoxFieldRendering(objectType: FieldRenderingType) {
  return function decorator(component: any) {
    if (objectType) {
      fieldType.set(objectType, component);
    }
  };
}

export function getMetadataBoxFieldRendering(objectType: string) {
  return fieldType.get(objectType.toUpperCase());
}
