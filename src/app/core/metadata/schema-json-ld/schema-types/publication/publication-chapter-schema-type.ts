import { Item } from '../../../../shared/item.model';
import { SchemaType } from '../schema-type';
import { schemaJsonLDForEntityAndType } from '../schema-type-decorator';

@schemaJsonLDForEntityAndType('Publication', 'book part')
export class PublicationChapterSchemaType extends SchemaType {

  protected createSchema(item: Item): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@id': '#book',
          '@type': 'Book',
          'author': SchemaType.getMetadataValue(item, 'dc.contributor.author'),
          'editor': SchemaType.getMetadataValue(item, 'dc.contributor.editor'),
          'isbn': SchemaType.getMetadataValue(item, 'dc.relation.isbn'),
          'name': SchemaType.getMetadataValue(item, 'dc.relation.publication\n'),
        },
        {
          '@type': 'Chapter',
          'isPartOf': {
            '@id': '#book'
          },
          'name': SchemaType.getMetadataValue(item, 'dc.title'),
          'alternateName': SchemaType.getMetadataValue(item, 'dc.title.alternative'),
          'pageStart': SchemaType.getMetadataValue(item, 'oaire.citation.startPage'),
          'pageEnd': SchemaType.getMetadataValue(item, 'oaire.citation.endPage'),
          'about': SchemaType.getMetadataValue(item, 'dc.subject'),
        }
      ]
    };
  }
}
