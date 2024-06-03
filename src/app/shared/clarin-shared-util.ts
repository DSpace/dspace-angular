import { DomSanitizer } from '@angular/platform-browser';
import { getFirstSucceededRemoteDataPayload } from '../core/shared/operators';
import { ConfigurationDataService } from '../core/data/configuration-data.service';
import { isNull, isUndefined } from './empty.util';
import { MetadataValue } from '../core/shared/metadata.models';
import { AuthorNameLink } from './clarin-item-box-view/clarin-author-name-link.model';

/**
 * Convert raw byte array to the image is not secure - this function make it secure
 * @param imageByteArray as secure byte array
 */
export function secureImageData(sanitizer: DomSanitizer,imageByteArray) {
  const objectURL = 'data:image/png;base64,' + imageByteArray;
  return sanitizer.bypassSecurityTrustUrl(objectURL);
}

export function getBaseUrl(configurationService: ConfigurationDataService): Promise<any> {
  return configurationService.findByPropertyName('dspace.ui.url')
    .pipe(getFirstSucceededRemoteDataPayload())
    .toPromise();
}

/**
 * Some metadata values in the Item View has links to redirect for search, this method decides what is the search field
 * based on the metadata field.
 *
 * @param field metadata field
 */
export function convertMetadataFieldIntoSearchType(field: string[]) {
  switch (true) {
    case field.includes('dc.contributor.author') || field.includes('dc.creator'):
      return 'author';
    case field.includes('dc.type'):
      return 'itemtype';
    case field.includes('dc.publisher') || field.includes('creativework.publisher'):
      return 'publisher';
    case field.includes('dc.language.iso') || field.includes('local.language.name'):
      return 'language';
    case field.includes('dc.subject'):
      return 'subject';
    default:
      return '';
  }
}

/**
 * Load Authors of the current item into BehaviourSubject - ItemAuthors. This method also compose
 * search link for every Author.
 *
 * @param item current Item
 * @param itemAuthors BehaviourSubject (async) of Authors with search links
 * @param baseUrl e.g. localhost:8080
 * @param fields metadata fields where authors are stored
 */
export function loadItemAuthors(item, itemAuthors, baseUrl, fields) {
  if (isNull(item) || isNull(itemAuthors) || isNull(baseUrl)) {
    return;
  }

  let authorsMV: MetadataValue[] = item?.allMetadata(fields);
  if (isUndefined(authorsMV)) {
    return null;
  }
  const itemAuthorsLocal = [];
  authorsMV.forEach((authorMV: MetadataValue) => {
    let value: string, operator: string;
    if (authorMV.authority) {
      value = encodeURIComponent(authorMV.authority);
      operator = 'authority';
    } else {
      value = encodeURIComponent(authorMV.value);
      operator = 'equals';
    }
    const authorSearchLink = baseUrl + '/search?f.author=' + value + ',' + operator;
    const authorNameLink = Object.assign(new AuthorNameLink(), {
      name: authorMV.value,
      url: authorSearchLink,
      isAuthority: !!authorMV.authority
    });
    itemAuthorsLocal.push(authorNameLink);
  });
  itemAuthors.next(itemAuthorsLocal);
}

export function makeLinks(text: string): string {
  // Use a regular expression to find URLs and convert them into clickable links
  const regex = /(?:https?|ftp):\/\/[^\s)]+|www\.[^\s)]+/g;
  return text?.replace(regex, (url) => `<a href="${url}" target="_blank">${url}</a>`);
}
