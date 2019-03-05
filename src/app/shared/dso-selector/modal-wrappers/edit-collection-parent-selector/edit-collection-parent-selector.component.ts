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
import { getCollectionEditPath } from '../../../../+collection-page/collection-page-routing.module';

@Component({
  selector: 'ds-edit-collection-parent-selector',
  // styleUrls: ['./edit-collection-parent-selector.component.scss'],
  templateUrl: './edit-collection-parent-selector.component.html',
})
export class EditCollectionParentSelectorComponent implements OnInit {
  @Input() collectionRD$: Observable<RemoteData<Collection>>;
  type = DSpaceObjectType.COLLECTION;

  constructor(private activeModal: NgbActiveModal, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.collectionRD$ = this.route.root.firstChild.firstChild.data.pipe(map(data => data.collection));
  }

  editCollection(dso: DSpaceObject) {
    this.close();
    this.router.navigate([getCollectionEditPath(dso.uuid)]);
  }

  close() {
    this.activeModal.close();
  }
}
