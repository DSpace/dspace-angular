import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Community } from '../../../../core/shared/community.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { Collection } from '../../../../core/shared/collection.model';
import { DSpaceObjectType } from '../../../../core/shared/dspace-object-type.model';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { hasValue } from '../../../empty.util';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'ds-create-item-parent-selector',
  // styleUrls: ['./create-item-parent-selector.component.scss'],
  templateUrl: './create-item-parent-selector.component.html',
})
export class CreateItemParentSelectorComponent implements OnInit {
  @Input() collectionRD$: Observable<RemoteData<Collection>>;
  type = DSpaceObjectType.COLLECTION;

  constructor(private activeModal: NgbActiveModal, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.root.firstChild.firstChild.data.pipe(map(data => data.collection));
  }

  createItem(dso: DSpaceObject) {
    this.activeModal.close();

    let path;
    //   path = this.createPath;
    // this.router.navigate([path]);
  }
}
