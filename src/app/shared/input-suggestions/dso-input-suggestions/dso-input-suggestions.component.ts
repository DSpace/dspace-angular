import {
  AsyncPipe,
  NgClass,
  NgFor,
} from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../../core/breadcrumbs/dso-name.service';
import { DSpaceObject } from '../../../core/shared/dspace-object.model';
import { ViewMode } from '../../../core/shared/view-mode.model';
import { hasValue } from '../../empty.util';
import { CollectionElementLinkType } from '../../object-collection/collection-element-link.type';
import { ListableObjectComponentLoaderComponent } from '../../object-collection/shared/listable-object/listable-object-component-loader.component';
import { ClickOutsideDirective } from '../../utils/click-outside.directive';
import { DebounceDirective } from '../../utils/debounce.directive';
import { InputSuggestionsComponent } from '../input-suggestions.component';

@Component({
  selector: 'ds-dso-input-suggestions',
  styleUrls: ['./../input-suggestions.component.scss'],
  templateUrl: './dso-input-suggestions.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // Usage of forwardRef necessary https://github.com/angular/angular.io/issues/1151
      // eslint-disable-next-line @angular-eslint/no-forward-ref
      useExisting: forwardRef(() => DsoInputSuggestionsComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [FormsModule, ClickOutsideDirective, DebounceDirective, NgClass, NgFor, ListableObjectComponentLoaderComponent, AsyncPipe, TranslateModule],
})

/**
 * Component representing a form with a autocomplete functionality for DSpaceObjects
 */
export class DsoInputSuggestionsComponent extends InputSuggestionsComponent {
  /**
   * The view mode of the listed object suggestions
   */
  viewMode = ViewMode.ListElement;

  /**
   * The available link types
   */
  linkTypes = CollectionElementLinkType;

  /**
   * The suggestions that should be shown
   */
  @Input() suggestions: DSpaceObject[] = [];

  currentObject: DSpaceObject;

  constructor(
    protected dsoNameService: DSONameService,
  ) {
    super();
  }

  onSubmit(data: DSpaceObject) {
    if (hasValue(data)) {
      this.value = this.dsoNameService.getName(data);
      this.currentObject = data;
      this.submitSuggestion.emit(data);
    }
  }

  onClickSuggestion(data: DSpaceObject) {
    this.value = this.dsoNameService.getName(data);
    this.currentObject = data;
    this.clickSuggestion.emit(data);
    this.close();
    this.blockReopen = true;
    this.queryInput.nativeElement.focus();
    return false;
  }
}
