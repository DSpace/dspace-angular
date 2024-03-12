import { Component } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { TranslateModule } from '@ngx-translate/core';

import { CollectionDropdownComponent as BaseComponent } from '../../../../../app/shared/collection-dropdown/collection-dropdown.component';

@Component({
  selector: 'ds-collection-dropdown',
  templateUrl: '../../../../../app/shared/collection-dropdown/collection-dropdown.component.html',
  // templateUrl: './collection-dropdown.component.html',
  styleUrls: ['../../../../../app/shared/collection-dropdown/collection-dropdown.component.scss'],
  // styleUrls: ['./collection-dropdown.component.scss']
  ,
  standalone: true,
  imports: [NgIf, FormsModule, ReactiveFormsModule, InfiniteScrollModule, NgFor, ThemedLoadingComponent, AsyncPipe, TranslateModule]
})
export class CollectionDropdownComponent extends BaseComponent {

}
