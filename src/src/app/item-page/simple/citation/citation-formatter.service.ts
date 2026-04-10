import { Injectable } from '@angular/core';
import { Item } from '../../../core/shared/item.model';
import { CitationData } from './models/citation.model';

@Injectable({ providedIn: 'root' })
export class CitationFormatterService {

  extractCitationData(item: Item, pageUrl: string): CitationData {
    const getFirst = (field: string): string =>
      item.firstMetadataValue(field) ?? '';

    const dateIssued = getFirst('dc.date.issued');
    const year = dateIssued ? dateIssued.split('-')[0] : 'n.d.';
    const url = getFirst('dc.identifier.uri') || pageUrl;

    return {
      authors: item.allMetadataValues(['dc.contributor.author', 'dc.creator']).filter(Boolean),
      title: getFirst('dc.title'),
      year,
      publisher: getFirst('dc.publisher') || 'Bhasha Sanchika — CIIL Repository',
      url,
      doi: getFirst('dc.identifier.doi'),
      itemType: getFirst('dc.type'),
      language: getFirst('dc.language') || getFirst('dc.language.iso'),
      glottocode: getFirst('dc.language.glottocode'),
      formatOs: getFirst('dc.format.os'),
      description: getFirst('dc.description.abstract') || getFirst('dc.description'),
    };
  }

  formatAPA(data: CitationData, includeDescription = false): string {
    const authors = this.formatAuthorsAPA(data.authors);
    let citation = `${authors} (${data.year}). ${data.title}`;
    if (data.publisher) { citation += `. ${data.publisher}`; }
    citation += data.doi ? `. https://doi.org/${data.doi}` : `. ${data.url}`;
    if (data.language)   { citation += `\nLanguage: ${data.language}`; }
    if (data.glottocode) { citation += `\nGlottocode: ${data.glottocode}`; }
    if (data.formatOs)   { citation += `\nOS/Format: ${data.formatOs}`; }
    if (includeDescription && data.description) {
      citation += `\n\nAbstract: ${data.description}`;
    }
    return citation;
  }

  formatBibTeX(data: CitationData, includeDescription = false): string {
    const key = this.generateBibTeXKey(data);
    const authors = data.authors.join(' and ');
    let bib = `@misc{${key},\n`;
    if (authors)          { bib += `  author    = {${authors}},\n`; }
    bib += `  title     = {${data.title}},\n`;
    bib += `  year      = {${data.year}},\n`;
    if (data.publisher)   { bib += `  publisher = {${data.publisher}},\n`; }
    if (data.language)    { bib += `  language  = {${data.language}},\n`; }
    if (data.glottocode)  { bib += `  glottocode = {${data.glottocode}},\n`; }
    if (data.formatOs)    { bib += `  os        = {${data.formatOs}},\n`; }
    if (data.doi)         { bib += `  doi       = {${data.doi}},\n`; }
    bib += `  url       = {${data.url}}`;
    if (includeDescription && data.description) {
      bib += `,\n  abstract  = {${data.description}}`;
    }
    bib += '\n}';
    return bib;
  }

  formatRIS(data: CitationData, includeDescription = false): string {
    let ris = 'TY  - GEN\n';
    data.authors.forEach(a => { ris += `AU  - ${a}\n`; });
    ris += `TI  - ${data.title}\n`;
    ris += `PY  - ${data.year}\n`;
    if (data.publisher)  { ris += `PB  - ${data.publisher}\n`; }
    if (data.language)   { ris += `LA  - ${data.language}\n`; }
    if (data.glottocode) { ris += `M1  - Glottocode: ${data.glottocode}\n`; }
    if (data.formatOs)   { ris += `M2  - OS/Format: ${data.formatOs}\n`; }
    if (data.doi)        { ris += `DO  - ${data.doi}\n`; }
    ris += `UR  - ${data.url}\n`;
    if (includeDescription && data.description) {
      ris += `AB  - ${data.description}\n`;
    }
    ris += 'ER  -\n';
    return ris;
  }

  private formatAuthorsAPA(authors: string[]): string {
    if (!authors || authors.length === 0) { return 'Anonymous'; }
    const fmt = authors.map(a => {
      const parts = a.split(',').map(s => s.trim());
      return parts.length >= 2
        ? `${parts[0]}, ${parts[1].charAt(0).toUpperCase()}.`
        : a;
    });
    if (fmt.length === 1) { return fmt[0]; }
    if (fmt.length === 2) { return `${fmt[0]}, & ${fmt[1]}`; }
    return `${fmt.slice(0, -1).join(', ')}, & ${fmt[fmt.length - 1]}`;
  }

  private generateBibTeXKey(data: CitationData): string {
    const author = data.authors.length > 0
      ? data.authors[0].split(',')[0].trim().toLowerCase().replace(/\s+/g, '')
      : 'unknown';
    const word = data.title.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${author}${data.year}${word}`;
  }
}
