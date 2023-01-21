import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ds-results-back-button',
  styleUrls: ['./results-back-button.component.scss'],
  templateUrl: './results-back-button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * Component to add back to result list button to item.
 */
export class ResultsBackButtonComponent implements OnInit {

  /**
   * The button type determines the button label.
   */
  @Input() buttonType?: string;

  /**
   * The function used for back navigation.
   */
  @Input() back: () => void;

  /**
   * The button label translation.
   */
  buttonLabel: Observable<string>;

  constructor(private translateService: TranslateService) {

  }

  ngOnInit(): void {
    // Set labels for metadata browse and item back buttons.
    if (this.buttonType === 'metadata-browse') {
      this.buttonLabel = this.translateService.get('browse.back.all-results');
    } else {
      this.buttonLabel = this.translateService.get('search.browse.item-back');
    }
  }

}
