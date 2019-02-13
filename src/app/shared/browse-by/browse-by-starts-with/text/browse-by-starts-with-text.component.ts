import { Component, Inject } from '@angular/core';
import { renderStartsWithFor } from '../browse-by-starts-with-decorator';
import { BrowseByStartsWithType } from '../../browse-by.component';
import { BrowseByStartsWithAbstractComponent } from '../browse-by-starts-with-abstract.component';

/**
 * A switchable component rendering StartsWith options for the type "Text".
 */
@Component({
  selector: 'ds-browse-by-starts-with-text',
  styleUrls: ['./browse-by-starts-with-text.component.scss'],
  templateUrl: './browse-by-starts-with-text.component.html'
})
@renderStartsWithFor(BrowseByStartsWithType.text)
export class BrowseByStartsWithTextComponent extends BrowseByStartsWithAbstractComponent {

}
