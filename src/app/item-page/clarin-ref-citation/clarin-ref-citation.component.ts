import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { isNull, isUndefined } from '../../shared/empty.util';
import { getFirstSucceededRemoteData } from '../../core/shared/operators';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgbModal, NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import { ClarinRefCitationModalComponent } from '../clarin-ref-citation-modal/clarin-ref-citation-modal.component';
import { GetRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { BehaviorSubject } from 'rxjs';
import {
  DOI_METADATA_FIELD, HANDLE_METADATA_FIELD,
} from '../simple/field-components/clarin-generic-item-field/clarin-generic-item-field.component';
import { ItemIdentifierService } from '../../shared/item-identifier.service';
import { AUTHOR_METADATA_FIELDS } from '../../core/shared/clarin/constants';

/**
 * If the item has more authors do not add all authors to the citation but add there a shortcut.
 */
export const ET_AL_TEXT = 'et al.';

/**
 * If the author is unknown, the citation should not contain the author.
 */
export const UNKNOWN_AUTHOR_MV = '(:unav) Unknown author';

/**
 * The citation part in the ref-box component.
 * The components shows formatted text, the copy button and the modal buttons for the copying citation
 * in the `bibtex` and `cmdi` format.
 */
@Component({
  selector: 'ds-clarin-ref-citation',
  templateUrl: './clarin-ref-citation.component.html',
  styleUrls: ['./clarin-ref-citation.component.scss']
})
export class ClarinRefCitationComponent implements OnInit {

  /**
   * The current item.
   */
  @Input() item: Item;

  /**
   * After clicking on the `Copy` icon the message `Copied` is popped up.
   */
  @ViewChild('tooltip', {static: false}) tooltipRef: NgbTooltip;

  /**
   * The parameters retrieved from the Item metadata for creating the citation in the proper way.
   */
  /**
   * Author and issued year
   */
  citationText: string;
  /**
   * Whole Handle URI
   */
  identifierURI: string;
  /**
   * Name of the Item
   */
  itemNameText: string;
  /**
   * The nam of the organization which provides the repository
   */
  repositoryNameText: string;
  /**
   * BehaviorSubject to store the prettified identifier.
   */
  prettifiedIdentifier: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  /**
   * The item has DOI or not.
   */
  hasDoi = false;

  /**
   * The authors of the item. Fetched from the metadata.
   */
  authors: string[] = [];

  constructor(private configurationService: ConfigurationDataService,
              private clipboard: Clipboard,
              public config: NgbTooltipConfig,
              private modalService: NgbModal,
              private requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected halService: HALEndpointService,
              private itemIdentifierService: ItemIdentifierService) {
    // Configure the tooltip to show on click - `Copied` message
    config.triggers = 'click';
  }

  ngOnInit(): void {
    this.authors = this.item.allMetadataValues(AUTHOR_METADATA_FIELDS);
    const author = this.getAuthors();
    const year = this.getYear();

    let citationArray = [author, year];
    // Do not show author if it is unknown
    if (this.isUnknownAuthor()) {
      citationArray = [year];
    }
    // Filter null values
    citationArray = citationArray.filter(textValue => {
      return textValue !== null;
    });

    this.hasDoi = this.hasItemDoi();
    this.citationText = citationArray.join(', ');
    this.itemNameText = this.getTitle();
    this.identifierURI = this.getIdentifierUri(this.whichIdentifierMetadataField());
    void this.itemIdentifierService.prettifyIdentifier(this.identifierURI, [this.whichIdentifierMetadataField()])
      .then((value: string) => {
        this.prettifiedIdentifier.next(value);
      });
    void this.getRepositoryName().then(res => {
      this.repositoryNameText = res?.payload?.values?.[0];
    });
  }

  /**
   * After click on the `Copy` icon the text will be formatted and copied for the user.
   */
  copyText() {
    const tabChar = '  ';
    let authorWithItemName = this.citationText + ',\n' + tabChar + this.itemNameText;
    if (this.isUnknownAuthor()) {
      // If the author is unknown, do not add the author to the citation
      authorWithItemName = this.itemNameText + ', ' + this.citationText;
    }
    this.clipboard.copy(authorWithItemName + ', ' +
      this.repositoryNameText + ', \n' + tabChar + this.identifierURI);
    setTimeout(() => {
      this.tooltipRef.close();
    }, 700);
  }

  getRepositoryName(): Promise<any> {
    return this.configurationService.findByPropertyName('dspace.name')
      .pipe(getFirstSucceededRemoteData()).toPromise();
  }

  /**
   * Get the identifier URI from the item metadata. If the item has DOI, return the DOI, otherwise return the handle.
   */
  getIdentifierUri(identifierMetadataField) {
    return this.item.firstMetadataValue(identifierMetadataField);
  }

  /**
   * Check if the item has DOI.
   */
  hasItemDoi() {
    return this.item?.allMetadata(DOI_METADATA_FIELD)?.length > 0;
  }

  /**
   * If the item has DOI, return the DOI metadata field, otherwise return the handle metadata field.
   */
  whichIdentifierMetadataField() {
    return this.hasDoi ? DOI_METADATA_FIELD : HANDLE_METADATA_FIELD;
  }

  getHandle() {
    // Separate the handle from the full URI
    const fullUri = this.getIdentifierUri(this.whichIdentifierMetadataField());
    const handleWord = 'handle/';
    const startHandleIndex = fullUri.indexOf('handle/') + handleWord.length;
    return fullUri.substr(startHandleIndex);
  }

  /**
   * Check if the author is unknown.
   * @param authorMetadata
   */
  isUnknownAuthor(authorMetadata: string[] = []) {
    if (authorMetadata.length === 0) {
      authorMetadata = this.authors;
    }
    return authorMetadata?.[0] === UNKNOWN_AUTHOR_MV;
  }

  getAuthors() {
    let authorText = '';
    const authorMetadata = this.authors;
    if (isUndefined(authorMetadata) || isNull(authorMetadata)) {
      return null;
    }

    // If metadata value is `(:unav) Unknown author` return null
    if (this.isUnknownAuthor(authorMetadata)) {
      return null;
    }

    // If there is only one author
    if (authorMetadata.length === 1) {
      return authorMetadata[0];
    }

    // If there are less than 5 authors
    if (authorMetadata.length <= 5) {
      let authors_list = authorMetadata.join('; ');
      // Replace last `;` with `and`
      authors_list = authors_list.replace(/;([^;]*)$/, ' and$1');
      return authors_list;
    }

    // If there are more than 5 authors
    // Get only first author and add `et al.` at the end
    authorText = authorMetadata[0] + '; ' + ET_AL_TEXT;
    return authorText;
  }

  getYear() {
    const yearMetadata = this.item.metadata['dc.date.issued'];
    if (isUndefined(yearMetadata) || isNull(yearMetadata)) {
      return null;
    }

    // The issued date is in the format '2000-01-01'
    const issuedDateValues = yearMetadata[0]?.value?.split('-');
    // Extract the year and return
    return issuedDateValues[0];
  }

  getTitle() {
    const titleMetadata = this.item.metadata['dc.title'];
    if (isUndefined(titleMetadata) || isNull(titleMetadata)) {
      return null;
    }

    return titleMetadata[0]?.value;
  }

  /**
   * Open the citation modal with the data retrieved from the OAI-PMH.
   * @param citationType
   */
  async openModal(citationType) {
    const modal = this.modalService.open(ClarinRefCitationModalComponent, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title'
    });
    modal.componentInstance.itemName = this.itemNameText;
    modal.componentInstance.citationType = citationType;
    // Fetch the citation text from the API
    let citationText = '';
    await this.getCitationText(citationType)
      .then(res => {
        citationText = res.payload?.metadata;
      });
    modal.componentInstance.citationText = citationText;
  }

  /**
   * Get the OAI-PMH data through the RefBox Controller
   */
  getCitationText(citationType): Promise<any> {
    const requestId = this.requestService.generateRequestId();
    // Create the request
    const getRequest = new GetRequest(requestId, this.halService.getRootHref() + '/core/refbox/citations?type=' +
      // citationType + '&handle=' + this.getHandle(), requestOptions);
    citationType + '&handle=' + this.getHandle());

    // Call get request
    this.requestService.send(getRequest);

    // Process and return the response
    return this.rdbService.buildFromRequestUUID(requestId)
      .pipe(getFirstSucceededRemoteData()).toPromise();
  }
}
