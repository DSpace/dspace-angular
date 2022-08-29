import { Item } from '../../../../shared/item.model';
import { SchemaType } from '../schema-type';
import { schemaJsonLDForEntityAndType } from '../schema-type-decorator';

@schemaJsonLDForEntityAndType('Publication', 'conference output')
@schemaJsonLDForEntityAndType('Publication', 'conference paper not in proceedings')
@schemaJsonLDForEntityAndType('Publication', 'conference poster not in proceedings')
@schemaJsonLDForEntityAndType('Publication', 'conference presentation')
@schemaJsonLDForEntityAndType('Publication', 'conference proceedings')
@schemaJsonLDForEntityAndType('Publication', 'conference paper')
@schemaJsonLDForEntityAndType('Publication', 'conference poster')
@schemaJsonLDForEntityAndType('Publication', 'journal')
@schemaJsonLDForEntityAndType('Publication', 'editorial')
@schemaJsonLDForEntityAndType('Publication', 'journal article')
@schemaJsonLDForEntityAndType('Publication', 'corrigendum')
@schemaJsonLDForEntityAndType('Publication', 'data paper')
@schemaJsonLDForEntityAndType('Publication', 'research article')
@schemaJsonLDForEntityAndType('Publication', 'review article')
@schemaJsonLDForEntityAndType('Publication', 'software paper')
@schemaJsonLDForEntityAndType('Publication', 'letter to the editor')
@schemaJsonLDForEntityAndType('Publication', 'preprint')
@schemaJsonLDForEntityAndType('Publication', 'working paper')
@schemaJsonLDForEntityAndType('Publication', 'book part')
export class PublicationScholarlyArticleSchemaType extends SchemaType {

  protected createSchema(item: Item): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@id': '#issue',
          '@type': 'PublicationIssue',
          'issueNumber': SchemaType.getMetadataValue(item, 'oaire.citation.issue'),
          'isPartOf': {
            '@id': '#periodical',
            '@type': [
              'PublicationVolume',
              'Periodical'
            ],
            'name': SchemaType.getMetadataValue(item, 'dc.relation.ispartof'),
            'issn': SchemaType.getMetadataValue(item, 'dc.relation.issn'),
            'volumeNumber': SchemaType.getMetadataValue(item, 'oaire.citation.volume'),
            'publisher': SchemaType.getMetadataValue(item, 'dc.publisher')
          }
        },
        {
          '@type': 'ScholarlyArticle',
          'isPartOf': '#issue',
          'abstract': SchemaType.getMetadataValue(item, 'dc.description.abstract'),
          'identifier': SchemaType.getMetadataValue(item, 'dc.identifier.*'),
          'about': SchemaType.getMetadataValue(item, 'dc.subject'),
          'pageStart': SchemaType.getMetadataValue(item, 'oaire.citation.startPage'),
          'pageEnd': SchemaType.getMetadataValue(item, 'oaire.citation.endPage'),
          'name': SchemaType.getMetadataValue(item, 'dc.title'),
          'author': SchemaType.getMetadataValue(item, 'dc.contributor.author'),
          'editor': SchemaType.getMetadataValue(item, 'dc.contributor.editor'),
          'datePublished': SchemaType.getMetadataValue(item, 'dc.date.issued'),
          'inLanguage': SchemaType.getMetadataValue(item, 'dc.language.iso'),
        }
      ]
    };
  }
}
