import { Injector } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BitstreamDataService } from '../../data/bitstream-data.service';
import { CollectionDataService } from '../../data/collection-data.service';
import { PaginatedList } from '../../data/paginated-list';
import { RemoteData } from '../../data/remote-data';
import { ResourcePolicyService } from '../../data/resource-policy.service';
import { Bitstream } from '../../shared/bitstream.model';
import { Collection } from '../../shared/collection.model';
import { Item } from '../../shared/item.model';
import { ResourcePolicy } from '../../shared/resource-policy.model';

export const getCollectionBuilder = (parentInjector: Injector, collection: Collection) => {
  const injector = Injector.create({
    providers:[
      {
        provide: CollectionBuilder,
        useClass: CollectionBuilder,
        deps:[
          CollectionDataService
        ]
      }
    ],
    parent: parentInjector
  });
  return injector.get(CollectionBuilder).initWithCollection(collection);
};

export class CollectionBuilder {
  private collection: Collection;
  private logo: Observable<RemoteData<Bitstream>>;
  // private license: Observable<RemoteData<License>>;
  private defaultAccessConditions: Observable<RemoteData<PaginatedList<ResourcePolicy>>>;

  constructor(
    protected collectionDataService: CollectionDataService,
    protected bitstreamDataService: BitstreamDataService,
    protected resourcePolicyService: ResourcePolicyService,
  ) {
  }

  initWithCollection(collection: Collection): CollectionBuilder {
    this.collection = collection;
    return this;
  }

  loadLogo(item: Item): CollectionBuilder {
    // this.logo = this.bitstreamDataService.getLogoFor(this.collection);
    return this;
  }

  loadDefaultAccessConditions(item: Item): CollectionBuilder {
    this.defaultAccessConditions = this.resourcePolicyService.getDefaultAccessConditionsFor(this.collection);
    return this;
  }

  /**
   * As far as I can tell, the rest api doesn't support licenses yet.
   * So I'm keeping this commented out
   */
  // loadLicense(): CollectionBuilder {
  //   this.license = this.bitstreamDataService.getLicenseFor(this.collection);
  //   return this;
  // }

  build(): Collection {
    const collection = this.collection;
    collection.logo = this.logo;
    // collection.license = this.license;
    collection.defaultAccessConditions = this.defaultAccessConditions;
    return collection;
  }

}
