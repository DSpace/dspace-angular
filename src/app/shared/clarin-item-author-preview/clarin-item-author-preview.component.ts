import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthorNameLink } from '../clarin-item-box-view/clarin-item-box-view.component';
import { getBaseUrl, loadItemAuthors } from '../clarin-shared-util';
import { Item } from '../../core/shared/item.model';
import { ConfigurationProperty } from '../../core/shared/configuration-property.model';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';

@Component({
  selector: 'ds-clarin-item-author-preview',
  templateUrl: './clarin-item-author-preview.component.html',
  styleUrls: ['./clarin-item-author-preview.component.scss']
})
export class ClarinItemAuthorPreviewComponent implements OnInit {

  @Input() item: Item;

  /**
   * Authors of the Item.
   */
  itemAuthors: BehaviorSubject<AuthorNameLink[]> = new BehaviorSubject<AuthorNameLink[]>([]);

  /**
   * If the Item have a lot of authors do not show them all.
   */
  showEveryAuthor: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * UI URL loaded from the server.
   */
  baseUrl = '';

  constructor(protected configurationService: ConfigurationDataService) { }

  async ngOnInit(): Promise<void> {
    await this.assignBaseUrl();
    loadItemAuthors(this.item, this.itemAuthors, this.baseUrl);
  }
  toggleShowEveryAuthor() {
    this.showEveryAuthor.next(!this.showEveryAuthor.value);
  }

  /**
   * Load base url from the configuration from the BE.
   */
  async assignBaseUrl() {
    this.baseUrl = await getBaseUrl(this.configurationService)
      .then((baseUrlResponse: ConfigurationProperty) => {
        return baseUrlResponse?.values?.[0];
      });
  }
}
