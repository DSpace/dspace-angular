import {
  Component,
  Input,
} from '@angular/core';
import {
  NgbModal,
  NgbModalModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ItemBibliographyService } from '../../../../../core/data/bibliography-data.service';
import { Bibliography } from '../../../../../core/shared/bibliography/bibliography.model';
import { BibliographyData } from '../../../../../core/shared/bibliography/bibliography-data.model';
import { Item } from '../../../../../core/shared/item.model';


@Component({
  selector: 'ds-item-page-bibliography',
  templateUrl: './item-page-bibliography.component.html',
  standalone: true,
  imports: [
    NgbModalModule,
    TranslateModule,
  ],
})
export class ItemPageBibliographyComponent {
  @Input() item: Item;
  bibliographies: Bibliography[] = [];
  loading = false;
  error = false;

  constructor(
    private bibliographyService: ItemBibliographyService,
    private modalService: NgbModal,
  ) {
  }

  openModal(content: any) {
    this.loading = true;
    this.error = false;

    this.bibliographyService.getBibliographies(this.item).subscribe({
      next: (bibliographyData: BibliographyData) => {
        this.bibliographies = bibliographyData?.bibliographies || [];
        this.loading = false;
        this.modalService.open(content, { size: 'lg' });
      },
      error: (err: unknown) => {
        this.loading = false;
        this.error = true;
        console.error(err);
      },
    });
  }

  copyToClipboard(value: string) {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;
    const plainText = tempElement.textContent || tempElement.innerText || '';

    navigator.clipboard.writeText(plainText).then(
      () => {
      },
      (err) => {
        console.error('Could not copy text: ', err);
      },
    );
  }
}
