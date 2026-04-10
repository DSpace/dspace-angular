export interface CitationData {
  authors: string[];
  title: string;
  year: string;
  publisher?: string;
  url: string;
  doi?: string;
  itemType?: string;
  language?: string;
  glottocode?: string;
  formatOs?: string;
  description?: string;
}

export type CitationTab = 'apa' | 'bibtex' | 'ris';
