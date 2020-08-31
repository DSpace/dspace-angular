import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RenderingTypeModel } from '../rendering-type.model';
import { MetadataBoxFieldRendering, FieldRendetingType } from '../metadata-box.decorator';
import { hasValue } from 'src/app/shared/empty.util';
import { ItemDataService } from 'src/app/core/data/item-data.service';
import { getFirstSucceededRemoteDataPayload } from 'src/app/core/shared/operators';
import { Observable, concat, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface CrisRef {
  id: string,
  icon: string,
  value: string
}

/**
 * This component renders the crisref metadata fields
 */
@Component({
  // tslint:disable-next-line: component-selector
  selector: 'span[ds-crisref].container',
  templateUrl: './crisref.component.html',
  styleUrls: ['./crisref.component.scss']
})
@MetadataBoxFieldRendering(FieldRendetingType.CRISREF)
export class CrisrefComponent extends RenderingTypeModel implements OnInit {

  private entity2icon: Map<string, string>;

  references: CrisRef[] = [];

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  constructor(
    private itemService: ItemDataService,
    private cdRef: ChangeDetectorRef) {
    super();

    this.entity2icon = new Map();
    const confValue = environment.layout.crisRef;
    confValue.forEach( (config) => {
      this.entity2icon.set(config.entityType.toUpperCase(), config.icon);
    });
  }

  ngOnInit() {
    // retrieve item metadata
    const itemMetadata = this.item.allMetadata( this.field.metadata );
    if (hasValue(itemMetadata)) {
      const itemObs: Array<Observable<CrisRef>> = [];
      itemMetadata.forEach( (metadata) => {
        if (hasValue(metadata.authority)) {
          itemObs.push(this.itemService.findById(metadata.authority).pipe(
            getFirstSucceededRemoteDataPayload(),
            map((item) => {
              return {
                id: metadata.authority,
                icon: this.getIcon( item.firstMetadataValue('relationship.type')),
                value: metadata.value
              };
            })
          ));
        }
      });
      const resultObs = concat(...itemObs);
      this.subs.push(resultObs.subscribe(
        (crisReference) => {
          this.references.push(crisReference);
        }, null,
        () => {
          this.cdRef.markForCheck();
        }
      ));
    }
  }

  /**
   * Returns the icon configured for given entityType, or
   * default icon if configuration not exists
   * @param entityType entity type name, ex. Person
   */
  getIcon(entityType: string): string {
    return this.entity2icon.has(entityType.toUpperCase()) ?
      this.entity2icon.get(entityType.toUpperCase()) :
      this.entity2icon.get('DEFAULT');
  }

  /**
   * Unsubscribes all subscriptions
   */
  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
