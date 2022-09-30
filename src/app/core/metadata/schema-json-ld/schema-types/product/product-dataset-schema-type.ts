import { Item } from '../../../../shared/item.model';
import { SchemaType } from '../schema-type';
import { schemaJsonLDForEntityAndType } from '../schema-type-decorator';

@schemaJsonLDForEntityAndType('Product', 'dataset')
@schemaJsonLDForEntityAndType('Product', 'aggregated data')
@schemaJsonLDForEntityAndType('Product', 'clinical trial data')
@schemaJsonLDForEntityAndType('Product', 'compiled data')
@schemaJsonLDForEntityAndType('Product', 'encoded data')
@schemaJsonLDForEntityAndType('Product', 'experimental data')
@schemaJsonLDForEntityAndType('Product', 'genomic data')
@schemaJsonLDForEntityAndType('Product', 'geospatial data')
@schemaJsonLDForEntityAndType('Product', 'laboratory notebook')
@schemaJsonLDForEntityAndType('Product', 'measurement and test data')
@schemaJsonLDForEntityAndType('Product', 'observational data')
@schemaJsonLDForEntityAndType('Product', 'recorded data')
@schemaJsonLDForEntityAndType('Product', 'simulation data')
@schemaJsonLDForEntityAndType('Product', 'survey data')
export class ProductDatasetSchemaType extends SchemaType {

  protected createSchema(item: Item): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      'issn': SchemaType.getMetadataValue(item, 'dc.identifier.issn'),
      'name': SchemaType.getMetadataValue(item, 'dc.title'),
      'alternateName': SchemaType.getMetadataValue(item, 'dc.title.alternative'),
      'dateCreated': SchemaType.getMetadataValue(item, 'dc.date.issued'),
      'version': SchemaType.getMetadataValue(item, 'dc.description.version'),
      'author': SchemaType.getMetadataValue(item, 'dc.contributor.author'),
      'inLanguage': SchemaType.getMetadataValue(item, 'dc.language.iso'),
      'about': SchemaType.getMetadataValue(item, 'dc.subject'),
      'abstract': SchemaType.getMetadataValue(item, 'dc.description.abstract'),
      'funding': SchemaType.getMetadataValue(item, 'dc.relation.funding'),
      'url': SchemaType.getMetadataValue(item, 'dc.description.uri')
    };
  }
}
