export enum FieldRendetingType {
  TEXT = 'text',
  HEADING = 'heading'
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
  return fieldType.get(objectType);
}
