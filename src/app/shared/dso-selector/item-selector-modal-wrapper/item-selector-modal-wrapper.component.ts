import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../../core/shared/community.model';
import { RemoteData } from '../../../core/data/remote-data';
import { Collection } from '../../../core/shared/collection.model';

@Component({
  selector: 'ds-item-selector-modal-wrapper',
  // styleUrls: ['./item-selector.component.scss'],
  templateUrl: './item-selector-modal-wrapper.component.html',
})
export class ItemSelectorModalWrapperComponent implements OnInit {
  @Input() collectionRD: RemoteData<Collection>;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.collectionRD = this.route.root.firstChild.firstChild.snapshot.data.collection;
  }
}
