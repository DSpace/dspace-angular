import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { BehaviorSubject } from 'rxjs';
import { isEmpty, isNotEmpty, isNull, isUndefined } from '../../shared/empty.util';
import { GetRequest } from '../../core/data/request.models';
import { RequestService } from '../../core/data/request.service';
import { RemoteDataBuildService } from '../../core/cache/builders/remote-data-build.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { ClarinFeaturedService } from '../../core/shared/clarin/clarin-featured-service.model';
import { ClarinFeaturedServiceLink } from '../../core/shared/clarin/clarin-featured-service-link.model';
import { HardRedirectService } from '../../core/services/hard-redirect.service';

/**
 * The component which shows Featured Service buttons based on the Item Metadata and the DSpace configuration.
 */
@Component({
  selector: 'ds-clarin-ref-featured-services',
  templateUrl: './clarin-ref-featured-services.component.html',
  styleUrls: ['./clarin-ref-featured-services.component.scss']
})
export class ClarinRefFeaturedServicesComponent implements OnInit {

  /**
   * The current Item
   */
  @Input() item: Item;

  /**
   * The URLs for calling the FB, Twitter sharing API
   */
  fbShareURL = 'http://www.facebook.com/sharer/sharer.php';
  twtrShareURL = 'http://twitter.com/intent/tweet';

  /**
   * Updated sharing URL based on the Item metadata
   */
  fbRedirectURL: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  twitterRedirectURL: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  /**
   * Featured Services for this Item. For each Featured Service is automatically rendered a button.
   */
  featuredServices: BehaviorSubject<ClarinFeaturedService[]> = new BehaviorSubject<ClarinFeaturedService[]>([]);

  constructor(private requestService: RequestService,
              protected rdbService: RemoteDataBuildService,
              protected halService: HALEndpointService,
              private hardRedirectService: HardRedirectService) { }

  ngOnInit(): void {
    this.prepareFbRedirectURL();
    this.prepareTwtrRedirectURL();
    this.loadFeaturedServices();
  }

  /**
   * Get the Featured Services for this Item based on the Item metadata and the DSpace configuration.
   */
  loadFeaturedServices() {
    const requestId = this.requestService.generateRequestId();
    const getRequest = new GetRequest(requestId, this.halService.getRootHref() + '/core/refbox/services?id=' +
      this.item.id);
    // Call get request
    this.requestService.send(getRequest);

    // Process the response
    this.rdbService.buildFromRequestUUID(requestId)
      .pipe(getFirstSucceededRemoteDataPayload())
      .subscribe(res => {
        // Parse the ClarinFeatureService objects from the `res.content`
        // @ts-ignore
        if (isNull(res?.content)) {
          return;
        }
        // @ts-ignore
        const featuredServicesResContent = res.content;
        const featuredServicesArray: ClarinFeaturedService[] = [];

        // If content is not array - do nothing it is wrong response
        if (!Array.isArray(featuredServicesResContent)) {
          return;
        }

        // Response has more Feature Service objects in the Array
        featuredServicesResContent.forEach(featuredServiceContent => {
          if (isNull(featuredServiceContent)) {
            return;
          }
          // Create the Feature Service object
          const featuredService = Object.assign(new ClarinFeaturedService(), {
            name: featuredServiceContent.name,
            url: featuredServiceContent.url,
            description: featuredServiceContent.description,
            featuredServiceLinks: []
          });

          // Do not show Feature Service button if the Item doesn't have the metadata for it.
          if (isNotEmpty(featuredServiceContent.featuredServiceLinks)) {
            featuredService.featuredServiceLinks =
              this.parseFeaturedServicesLinks(featuredServiceContent.featuredServiceLinks);
          }

          featuredServicesArray.push(featuredService);
        });

        // Update the featuredServices async property.
        this.featuredServices.next(featuredServicesArray);
      });

  }

  /**
   * Each Feature Service has the Feature Service Link objects for redirecting to the another language.
   * Add appropriate Feature Service Links to the Feature Service
   * @param featuredServiceLinksContent
   */
  parseFeaturedServicesLinks(featuredServiceLinksContent) {
    if (isEmpty(featuredServiceLinksContent)) {
      return [];
    }

    if (!Array.isArray(featuredServiceLinksContent)) {
      return [];
    }

    const featuredServiceLinksArray: ClarinFeaturedServiceLink[] = [];
    featuredServiceLinksContent.forEach(responseContent => {
      const featureServiceLink = Object.assign(new ClarinFeaturedServiceLink(),{
        key: responseContent.key,
        value: responseContent.value
      });
      featuredServiceLinksArray.push(featureServiceLink);
    });

    return featuredServiceLinksArray;
  }

  /**
   * Add handle to the FB sharing URL
   */
  prepareFbRedirectURL() {
    const itemHandle = this.getMetadata('dc.identifier.uri');
    if (isNull(itemHandle)) {
      return;
    }

    // Compose the URL
    const redirectURL = this.fbShareURL + '?u=' + itemHandle;
    this.fbRedirectURL.next(redirectURL);
  }

  /**
   * Add handle and the item name to the Twitter sharing URL
   */
  prepareTwtrRedirectURL() {
    const itemHandle = this.getMetadata('dc.identifier.uri');
    const itemName = this.getMetadata('dc.title');
    if (isNull(itemHandle)) {
      return;
    }

    // Compose the URL
    let redirectURL = this.twtrShareURL + '?url=' + itemHandle;
    redirectURL = isNull(itemName) ? redirectURL : redirectURL + '&text=' + itemName;
    this.twitterRedirectURL.next(redirectURL);
  }

  getMetadata(metadataName) {
    const metadata = this.item.metadata[metadataName];
    if (isUndefined(metadata) || isNull(metadata)) {
      return null;
    }

    return metadata[0]?.value;
  }
}
