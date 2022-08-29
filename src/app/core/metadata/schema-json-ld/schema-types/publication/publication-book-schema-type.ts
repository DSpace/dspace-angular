import { Item } from '../../../../shared/item.model';
import { SchemaType } from '../schema-type';
import { schemaJsonLDForEntityAndType } from '../schema-type-decorator';

@schemaJsonLDForEntityAndType('Publication', 'book')
export class PublicationBookSchemaType extends SchemaType {

  protected createSchema(item: Item): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Book',
      'isbn': SchemaType.getMetadataValue(item, 'dc.identifier.isbn'),
      'name': SchemaType.getMetadataValue(item, 'dc.title'),
      'author': SchemaType.getMetadataValue(item, 'dc.contributor.author'),
      'editor': SchemaType.getMetadataValue(item, 'dc.contributor.editor'),
      'datePublished': SchemaType.getMetadataValue(item, 'dc.date.issued'),
      'description': SchemaType.getMetadataValue(item, 'dc.description.abstract'),
      'genre': SchemaType.getMetadataValue(item, 'dc.subject'),
      'inLanguage': SchemaType.getMetadataValue(item, 'dc.language.iso'),
      'publisher': SchemaType.getMetadataValue(item, 'dc.publisher')
    };
  }
}
