import { Component, Input, OnInit } from '@angular/core';
import { Item } from '../../core/shared/item.model';
import { ActivatedRoute } from '@angular/router';
import { DSONameService } from '../../core/breadcrumbs/dso-name.service';

// Property for the configuration service to get help-desk mail property from the server
export const HELP_DESK_PROPERTY = 'lr.help.mail';

@Component({
  selector: 'ds-tombstone',
  templateUrl: './tombstone.component.html',
  styleUrls: ['./tombstone.component.scss']
})
export class TombstoneComponent implements OnInit {

  /**
   * The withdrawn Item
   */
  @Input() item: Item;

  /**
   * The reason of withdrawal of the item which is loaded from the metadata: `local.withdrawn.reason`
   */
  reasonOfWithdrawal: string;

  /**
   * The new destination of the item which is loaded from the metadata: `dc.relation.isreplaced.by`
   */
  isReplaced: string;

  /**
   * Authors of the item loaded from `dc.contributor.author` and `dc.contributor.other` metadata
   */
  authors = [];

  /**
   * The name of the item loaded from the dsoService
   */
  itemName: string;

  constructor(protected route: ActivatedRoute,
              private dsoNameService: DSONameService) { }

  ngOnInit(): void {
    // Load the new destination from metadata
    this.isReplaced = this.item?.metadata['dc.relation.isreplacedby']?.[0]?.value;

    // Load the reason of withdrawal from metadata
    this.reasonOfWithdrawal = this.item?.metadata['local.withdrawn.reason']?.[0]?.value;

    // Load authors
    this.addAuthorsFromMetadata('dc.contributor.author');
    this.addAuthorsFromMetadata('dc.contributor.other');

    // Get name of the Item
    this.itemName = this.dsoNameService.getName(this.item);
  }

  /**
   * From the metadata field load value and add it to the `this.authors` list
   * @param metadataField where are authors
   * @private
   */
  private addAuthorsFromMetadata(metadataField) {
    this.item?.metadata?.[metadataField]?.forEach(value => {
      this.authors.push(value?.value);
    });
  }

}
