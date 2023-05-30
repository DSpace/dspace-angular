import { SchemaType } from './schema-type';
import { GenericConstructor } from '../../../shared/generic-constructor';

const schemaJsonProvidersMapByEntity: Map<string, GenericConstructor<SchemaType>> = new Map<string, GenericConstructor<SchemaType>>();
const schemaJsonProvidersMapByType: Map<string, Map<string, GenericConstructor<SchemaType>>> = new Map<string, Map<string, GenericConstructor<SchemaType>>>();

export function schemaJsonLDForEntity(entityType: string) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    schemaJsonProvidersMapByEntity.set(entityType, objectElement);
  };
}

export function schemaJsonLDForEntityAndType(entityType: string, dctype: string) {
  return function decorator(objectElement: any) {
    if (!objectElement) {
      return;
    }
    if (schemaJsonProvidersMapByType.has(entityType)) {
      schemaJsonProvidersMapByType.get(entityType).set(dctype, objectElement);
    } else {
      schemaJsonProvidersMapByType.set(entityType, new Map([[dctype, objectElement]]));
    }
  };
}

export function getSchemaJsonLDProviderByEntity(entityType: string): GenericConstructor<SchemaType> {
  return schemaJsonProvidersMapByEntity.get(entityType);
}

export function getSchemaJsonLDProviderByType(entityType: string, dctype: string): GenericConstructor<SchemaType> {
  return schemaJsonProvidersMapByType.get(entityType)?.get(dctype);
}
