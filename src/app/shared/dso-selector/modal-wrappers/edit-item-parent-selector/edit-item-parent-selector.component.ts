import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Community } from '../../../../core/shared/community.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Collection } from '../../../../core/shared/collection.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Item } from '../../../../core/shared/item.model';
import { getItemEditPath } from '../../../../+item-page/item-page-routing.module';

@Component({
  selector: 'ds-edit-item-parent-selector',
  // styleUrls: ['./edit-item-parent-selector.component.scss'],
  templateUrl: './edit-item-parent-selector.component.html',
})
export class EditItemParentSelectorComponent implements OnInit {
  @Input() itemRD$: Observable<RemoteData<Item>>;
  type = DSpaceObjectType.ITEM;

  constructor(private activeModal: NgbActiveModal, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.itemRD$ = this.route.root.firstChild.firstChild.data.pipe(map(data => data.item));
  }

  editItem(dso: DSpaceObject) {
    this.close();
    this.router.navigate([getItemEditPath(dso.uuid)]);
  }

  close() {
    this.activeModal.close();
  }
}
