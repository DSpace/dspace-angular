import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Item } from '../../../../core/shared/item.model';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ConfigurationDataService } from '../../../../core/data/configuration-data.service';
import { isEmpty, isNotEmpty } from '../../../../shared/empty.util';
import { getFirstCompletedRemoteData } from '../../../../core/shared/operators';
import { map } from 'rxjs/operators';
import { DOI_METADATA_FIELD } from '../clarin-generic-item-field/clarin-generic-item-field.component';

const DEFAULT_DOI_RESOLVER = 'https://doi.org/';
const DOI_RESOLVER_CFG_PROPERTY = 'identifier.doi.resolver';

@Component({
  selector: 'ds-clarin-identifier-item-field',
  templateUrl: './clarin-identifier-item-field.component.html',
  styleUrls: ['./clarin-identifier-item-field.component.scss']
})
export class ClarinIdentifierItemFieldComponent implements OnInit {

  /**
   * After clicking on the `Copy` icon the message `Copied` is popped up.
   */
  @ViewChild('copyButton', {static: false}) copyButtonRef: NgbTooltip;

  /**
   * The item to display metadata for
   */
  @Input() item: Item;

  /**
   * Fields (schema.element.qualifier) used to render their values.
   */
  @Input() fields: string[];

  /**
   * The DOI resolver URL. It is a `identifier.doi.resolver` property or the default resolver (constant).
   */
  doiResolver: string;

  /**
   * The identifier of the item. DOI or handle.
   */
  identifier: string;

  /**
   * BehaviorSubject to store the prettified identifier.
   */
  prettifiedIdentifier: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private configurationService: ConfigurationDataService,
              private clipboard: Clipboard) {
  }

  ngOnInit(): void {
    this.identifier = this.item?.firstMetadataValue(this.fields);
    void this.prettifyIdentifier(this.identifier);
  }


  /**
   * Copy the metadata value to the clipboard. After clicking on the `Copy` icon the message `Copied` is popped up.
   *
   * @param value
   */
  copyToClipboard(value: string) {
    this.clipboard.copy(value);
    setTimeout(() => {
      this.copyButtonRef.close();
    }, 700);
  }

  /**
   * Prettify the identifier. If the identifier is DOI, remove the DOI resolver from it.
   *
   * @param identifier
   */
  async prettifyIdentifier(identifier: string) {
    if (isEmpty(identifier)) {
      this.prettifiedIdentifier.next(null);
      return;
    }

    // Do not prettify the identifier if it is not DOI.
    if (!this.fields.includes(DOI_METADATA_FIELD)) {
      this.prettifiedIdentifier.next(identifier);
      return;
    }

    // If the DOI resolver is set, use it. It is not set by default.
    if (isNotEmpty(this.doiResolver)) {
      this.removeDoiResolverFromIdentifier(identifier);
      return;
    }

    // Get the DOI resolver from the configuration.
    const cfgDoiResolver = await firstValueFrom(this.loadDoiResolverConfiguration());

    // If the configuration is not set, use the default resolver.
    this.doiResolver = isEmpty(cfgDoiResolver) ? DEFAULT_DOI_RESOLVER : cfgDoiResolver;

    // Remove the DOI resolver from the identifier.
    this.removeDoiResolverFromIdentifier(identifier);
  }

  /**
   * Remove the DOI resolver from the identifier.
   *
   * @param identifier
   */
  removeDoiResolverFromIdentifier(identifier: string) {
    this.prettifiedIdentifier.next(identifier.replace(this.doiResolver, ''));
  }

  /**
   * Load the DOI resolver from the configuration. It is a `identifier.doi.resolver` property.
   */
  loadDoiResolverConfiguration() {
    return this.configurationService.findByPropertyName(DOI_RESOLVER_CFG_PROPERTY)
      .pipe(
        getFirstCompletedRemoteData(),
        map((config) => config?.payload?.values?.[0]));
  }
}
