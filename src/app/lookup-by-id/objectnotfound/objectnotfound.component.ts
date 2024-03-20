
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  RouterLink,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * This component representing the `PageNotFound` DSpace page.
 */
@Component({
  selector: 'ds-objnotfound',
  styleUrls: ['./objectnotfound.component.scss'],
  templateUrl: './objectnotfound.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [RouterLink, TranslateModule],
})
export class ObjectNotFoundComponent implements OnInit {

  idType: string;

  id: string;

  missingItem: string;

  /**
   * Initialize instance variables
   *
   * @param {AuthService} authservice
   * @param {ServerResponseService} responseService
   */
  constructor(private route: ActivatedRoute) {
    route.params.subscribe((params) => {
      this.idType = params.idType;
      this.id = params.id;
    });
  }

  ngOnInit(): void {
    if (this.idType.startsWith('handle') || this.idType.startsWith('uuid')) {
      this.missingItem = this.idType + ': ' + this.id;
    } else {
      this.missingItem = 'handle: ' + this.idType + '/' + this.id;
    }
  }

}
