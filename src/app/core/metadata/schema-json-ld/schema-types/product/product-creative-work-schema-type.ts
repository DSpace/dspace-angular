import { isNotEmpty } from '../../../../../shared/empty.util';
import { Item } from '../../../../shared/item.model';
import { SchemaType } from '../schema-type';
import { schemaJsonLDForEntity } from '../schema-type-decorator';

@schemaJsonLDForEntity('Product')
export class ProductCreativeWorkSchemaType extends SchemaType {

  protected createSchema(item: Item): Record<string, any> {

    const description: string|string[] = isNotEmpty(SchemaType.getMetadataValue(item, 'dc.description')) ?
      SchemaType.getMetadataValue(item, 'dc.description') :
      SchemaType.getMetadataValue(item, 'dc.description.abstract');

    return {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      'identifier': SchemaType.getMetadataValue(item, 'dc.identifier.*'),
      'name': SchemaType.getMetadataValue(item, 'dc.title'),
      'alternateName': SchemaType.getMetadataValue(item, 'dc.title.alternative'),
      'dateCreated': SchemaType.getMetadataValue(item, 'dc.date.issued'),
      'author': SchemaType.getMetadataValue(item, 'dc.contributor.author'),
      'editor': SchemaType.getMetadataValue(item, 'dc.contributor.editor'),
      'inLanguage': SchemaType.getMetadataValue(item, 'dc.language.iso'),
      'genre': SchemaType.getMetadataValue(item, 'dc.subject'),
      'abstract': SchemaType.getMetadataValue(item, 'dc.description.abstract'),
      'description': description,
      'funding': SchemaType.getMetadataValue(item, 'dc.relation.funding'),
      'sponsor': SchemaType.getMetadataValue(item, 'dc.description.sponsorship')
    };
  }
}
