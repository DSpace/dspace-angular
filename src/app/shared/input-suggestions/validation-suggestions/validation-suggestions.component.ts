import {
  AsyncPipe,
  NgClass,
  NgFor,
} from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ObjectUpdatesService } from '../../../core/data/object-updates/object-updates.service';
import { MetadatumViewModel } from '../../../core/shared/metadata.models';
import { ClickOutsideDirective } from '../../utils/click-outside.directive';
import { DebounceDirective } from '../../utils/debounce.directive';
import { MetadataFieldValidator } from '../../utils/metadatafield-validator.directive';
import { InputSuggestionsComponent } from '../input-suggestions.component';
import { InputSuggestion } from '../input-suggestions.model';

@Component({
  selector: 'ds-validation-suggestions',
  styleUrls: ['./../input-suggestions.component.scss'],
  templateUrl: './validation-suggestions.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // Usage of forwardRef necessary https://github.com/angular/angular.io/issues/1151
      // eslint-disable-next-line @angular-eslint/no-forward-ref
      useExisting: forwardRef(() => ValidationSuggestionsComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ClickOutsideDirective, DebounceDirective, NgClass, NgFor, AsyncPipe, TranslateModule],
})

/**
 * Component representing a form with a autocomplete functionality
 */
export class ValidationSuggestionsComponent extends InputSuggestionsComponent implements OnInit {

  form: UntypedFormGroup;

  /**
   * The current url of this page
   */
  @Input() url: string;

  /**
   * The metadatum of this field
   */
  @Input() metadata: MetadatumViewModel;

  /**
   * The suggestions that should be shown
   */
  @Input() suggestions: InputSuggestion[] = [];
  /**
   * The possibility to edit metadata
   */
  @Input() disable;
  constructor(private metadataFieldValidator: MetadataFieldValidator,
              private objectUpdatesService: ObjectUpdatesService) {
    super();
  }

  ngOnInit() {
    this.form = new UntypedFormGroup({
      metadataNameField: new UntypedFormControl(this._value, {
        asyncValidators: [this.metadataFieldValidator.validate.bind(this.metadataFieldValidator)],
        validators: [Validators.required],
      }),
    });
  }

  onSubmit(data) {
    this.value = data;
    this.submitSuggestion.emit(data);
  }

  onClickSuggestion(data) {
    this.value = data;
    this.clickSuggestion.emit(data);
    this.close();
    this.blockReopen = true;
    this.queryInput.nativeElement.focus();
    return false;
  }

  /**
   * Check if the input is valid according to validator and send (in)valid state to store
   * @param form  Form with input
   */
  checkIfValidInput(form) {
    this.valid = !(form.get('metadataNameField').status === 'INVALID' && (form.get('metadataNameField').dirty || form.get('metadataNameField').touched));
    this.objectUpdatesService.setValidFieldUpdate(this.url, this.metadata.uuid, this.valid);
    return this.valid;
  }

}
