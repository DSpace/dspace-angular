import { Component, Input } from '@angular/core';
import { Item } from 'src/app/core/shared/item.model';
import { OrcidComponent } from 'src/app/cris-layout/cris-layout-matrix/cris-layout-box-container/boxes/metadata/rendering-types/orcid/orcid.component';

@Component({
  selector: 'ds-metadata-link-view-orcid',
  templateUrl: './metadata-link-view-orcid.component.html',
  styleUrls: ['./metadata-link-view-orcid.component.scss']
})
export class MetadataLinkViewOrcidComponent extends OrcidComponent {

  @Input() itemValue: Item;

  ngOnInit(): void {
    this.item = this.itemValue;
    super.ngOnInit();
  }

}
