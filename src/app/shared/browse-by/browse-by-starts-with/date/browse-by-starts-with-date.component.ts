import { Component } from '@angular/core';
import { renderStartsWithFor } from '../browse-by-starts-with-decorator';
import { BrowseByStartsWithType } from '../../browse-by.component';
import { BrowseByStartsWithAbstractComponent } from '../browse-by-starts-with-abstract.component';

@Component({
  selector: 'ds-browse-by-starts-with-date',
  styleUrls: ['./browse-by-starts-with-date.component.scss'],
  templateUrl: './browse-by-starts-with-date.component.html'
})
@renderStartsWithFor(BrowseByStartsWithType.date)
export class BrowseByStartsWithDateComponent extends BrowseByStartsWithAbstractComponent {

}
