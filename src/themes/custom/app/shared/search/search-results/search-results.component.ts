import {
  SearchResultsComponent as BaseComponent
} from '../../../../../../app/shared/search/search-results/search-results.component';
import { Component } from '@angular/core';
import { fadeIn, fadeInOut } from '../../../../../../app/shared/animations/fade';
import { NgIf } from '@angular/common';
import {
  SearchExportCsvComponent
} from '../../../../../../app/shared/search/search-export-csv/search-export-csv.component';
import { ObjectCollectionComponent } from '../../../../../../app/shared/object-collection/object-collection.component';
import { ThemedLoadingComponent } from '../../../../../../app/shared/loading/themed-loading.component';
import { ErrorComponent } from '../../../../../../app/shared/error/error.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'ds-search-results',
  // templateUrl: './search-results.component.html',
  templateUrl: '../../../../../../app/shared/search/search-results/search-results.component.html',
  // styleUrls: ['./search-results.component.scss'],
  animations: [
    fadeIn,
    fadeInOut
  ],
  standalone: true,
  imports: [NgIf, SearchExportCsvComponent, ObjectCollectionComponent, ThemedLoadingComponent, ErrorComponent, RouterLink, TranslateModule]
})
export class SearchResultsComponent extends BaseComponent {

}
