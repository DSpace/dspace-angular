import { Component, Input } from '@angular/core';

@Component({
  selector: 'ds-comcol-page-browse-by',
  templateUrl: './comcol-page-browse-by.component.html',
})
export class ComcolPageBrowseByComponent {
  @Input() id: string;
}
