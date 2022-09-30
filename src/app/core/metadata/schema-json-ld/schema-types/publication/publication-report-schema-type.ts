import { Item } from '../../../../shared/item.model';
import { SchemaType } from '../schema-type';
import { schemaJsonLDForEntityAndType } from '../schema-type-decorator';

@schemaJsonLDForEntityAndType('Publication', 'report')
@schemaJsonLDForEntityAndType('Publication', 'clinical study')
@schemaJsonLDForEntityAndType('Publication', 'data management plan')
@schemaJsonLDForEntityAndType('Publication', 'memorandum')
@schemaJsonLDForEntityAndType('Publication', 'policy report')
@schemaJsonLDForEntityAndType('Publication', 'project deliverable')
@schemaJsonLDForEntityAndType('Publication', 'research protocol')
@schemaJsonLDForEntityAndType('Publication', 'research report')
@schemaJsonLDForEntityAndType('Publication', 'technical report')
export class PublicationReportSchemaType extends SchemaType {

  protected createSchema(item: Item): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Report',
      'isbn': SchemaType.getMetadataValue(item, 'dc.identifier.isbn'),
      'name': SchemaType.getMetadataValue(item, 'dc.title'),
      'author': SchemaType.getMetadataValue(item, 'dc.contributor.author'),
      'editor': SchemaType.getMetadataValue(item, 'dc.contributor.editor'),
      'dateCreated': SchemaType.getMetadataValue(item, 'dc.date.issued'),
      'abstract': SchemaType.getMetadataValue(item, 'dc.description.abstract'),
      'about': SchemaType.getMetadataValue(item, 'dc.subject'),
      'inLanguage': SchemaType.getMetadataValue(item, 'dc.language.iso'),
      'reportNumber': SchemaType.getMetadataValue(item, 'dc.relation.ispartofseries')
    };
  }
}
