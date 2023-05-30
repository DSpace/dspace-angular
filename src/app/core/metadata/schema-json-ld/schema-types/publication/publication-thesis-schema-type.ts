import { Item } from '../../../../shared/item.model';
import { SchemaType } from '../schema-type';
import { schemaJsonLDForEntityAndType } from '../schema-type-decorator';

@schemaJsonLDForEntityAndType('Publication', 'thesis')
@schemaJsonLDForEntityAndType('Publication', 'bachelor thesis')
@schemaJsonLDForEntityAndType('Publication', 'doctoral thesis')
@schemaJsonLDForEntityAndType('Publication', 'master thesis')
export class PublicationThesisSchemaType extends SchemaType {

  protected createSchema(item: Item): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Thesis',
      'author': SchemaType.getMetadataValue(item, 'dc.contributor.author'),
      'editor': SchemaType.getMetadataValue(item, 'dc.contributor.editor'),
      'inSupportOf': 'Conservation Biology',
      'name': SchemaType.getMetadataValue(item, 'dc.title'),
      'abstract': SchemaType.getMetadataValue(item, 'dc.description.abstract'),
      'identifier': SchemaType.getMetadataValue(item, 'dc.identifier.*'),
      'dateCreated': SchemaType.getMetadataValue(item, 'dc.date.issued'),
      'sourceOrganization': SchemaType.getMetadataValue(item, 'oairecerif.author.affiliation'),
      'inLanguage': SchemaType.getMetadataValue(item, 'dc.language.iso'),
    };
  }
}
