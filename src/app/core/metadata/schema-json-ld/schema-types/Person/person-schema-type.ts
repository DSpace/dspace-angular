import { Item } from '../../../../shared/item.model';
import { SchemaType } from '../schema-type';
import { schemaJsonLDForEntity } from '../schema-type-decorator';

@schemaJsonLDForEntity('Person')
export class PersonSchemaType extends SchemaType {

  protected createSchema(item: Item): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': SchemaType.getMetadataValue(item, 'dc.title'),
      'givenName': SchemaType.getMetadataValue(item, 'person.givenName'),
      'familyName': SchemaType.getMetadataValue(item, 'person.familyName'),
      'birthDate': SchemaType.getMetadataValue(item, 'person.birthDate'),
      'gender': SchemaType.getMetadataValue(item, 'oairecerif.person.gender'),
      'jobTitle': SchemaType.getMetadataValue(item, 'person.jobTitle'),
      'affiliation': SchemaType.getMetadataValue(item, 'person.affiliation.name'),
      'url': SchemaType.getMetadataValue(item, 'oairecerif.identifier.url'),
      'email': SchemaType.getMetadataValue(item, 'person.email'),
      'identifier': SchemaType.getMetadataValue(item, 'person.identifier.*'),
      'nationality': SchemaType.getMetadataValue(item, 'crisrp.country'),
      'knowsLanguage': SchemaType.getMetadataValue(item, 'person.knowsLanguage')
    };
  }
}
