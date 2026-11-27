import { Config } from './config.interface';

/**
 * Metadata fields used to fill each Google Scholar / Highwire Press `citation_*` `<meta>` tag
 * that the {@link HeadTagService} adds to Item pages.
 *
 * Each entry is an ordered list of metadata keys. Wildcards are supported (e.g. `dc.contributor.*`).
 * An empty list disables the tag.
 */
export interface CitationMetaTagFieldsConfig extends Config {
  /** `citation_title`: the first value of the first listed field that has one */
  title: string[];
  /** `citation_author`: one tag per value, for all values of all listed fields, in the listed order */
  author: string[];
  /** `citation_publication_date`: the first value of the first listed field that has one */
  publicationDate: string[];
  /** `citation_issn`: the first value of the first listed field that has one */
  issn: string[];
  /** `citation_isbn`: the first value of the first listed field that has one */
  isbn: string[];
  /** `citation_language`: the first value of the first listed field that has one */
  language: string[];
  /** `citation_keywords`: all values of all listed fields, joined with "; " */
  keywords: string[];
  /**
   * `citation_abstract_html_url`: the first value of the first listed field that has one.
   * Falls back to the URL of the current page when none of the fields has a value.
   */
  abstractHtmlUrl: string[];
  /** `citation_doi`: the first value of the first listed field that has one */
  doi: string[];
  /** `citation_publisher`: used for Items that are neither a dissertation nor a technical report */
  publisher: string[];
  /** `citation_dissertation_name`: only added for dissertations */
  dissertationName: string[];
  /** `citation_dissertation_institution`: used instead of `citation_publisher` for dissertations */
  dissertationInstitution: string[];
  /** `citation_technical_report_institution`: used instead of `citation_publisher` for technical reports */
  technicalReportInstitution: string[];
}

/**
 * Configuration of the Google Scholar / Highwire Press `citation_*` `<meta>` tags on Item pages.
 * See https://scholar.google.com/intl/en/scholar/inclusion.html#indexing
 */
export interface CitationMetaTagsConfig extends Config {
  /** The metadata fields used for each tag */
  fields: CitationMetaTagFieldsConfig;
  /** `dc.type` values (case-insensitive) that identify an Item as a dissertation */
  dissertationTypes: string[];
  /** `dc.type` values (case-insensitive) that identify an Item as a technical report */
  technicalReportTypes: string[];
  /**
   * When an Item has no downloadable primary Bitstream and more than one Bitstream in its ORIGINAL bundle,
   * `citation_pdf_url` links to the first downloadable Bitstream whose format has one of these MIME types.
   */
  pdfUrlMimeTypes: string[];
}
