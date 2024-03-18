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

/**
 * If the item has more authors do not add all authors to the citation but add there a shortcut.
 */
export const ET_AL_TEXT = 'et al.';

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
    const author = this.getAuthors();
    const year = this.getYear();

    let citationArray = [author, year];
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
    this.clipboard.copy(this.citationText + ',\n' + tabChar + this.itemNameText + ', ' +
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

  getAuthors() {
    let authorText = '';
    const authorMetadata = this.item.metadata['dc.contributor.author'];
    if (isUndefined(authorMetadata) || isNull(authorMetadata)) {
      return null;
    }

    authorText = authorMetadata[0]?.value;
    // There are more authors for the item
    if (authorMetadata.length > 1) {
      authorText = authorText + '; ' + ET_AL_TEXT;
    }

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
