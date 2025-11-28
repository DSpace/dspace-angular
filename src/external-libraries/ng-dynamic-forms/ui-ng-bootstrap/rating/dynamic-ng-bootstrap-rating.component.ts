import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import {
  NgbRating,
  NgbRatingConfig,
  NgbRatingModule,
} from '@ng-bootstrap/ng-bootstrap';
import { DynamicFormControlComponent } from '@ng-dynamic-forms/core/component/dynamic-form-control.component';
import { DynamicFormControlCustomEvent } from '@ng-dynamic-forms/core/component/dynamic-form-control-event';
import { DynamicFormControlLayout } from '@ng-dynamic-forms/core/model/misc/dynamic-form-control-layout.model';
import { DynamicRatingModel } from '@ng-dynamic-forms/core/model/rating/dynamic-rating.model';
import {
  DynamicFormLayout,
  DynamicFormLayoutService,
} from '@ng-dynamic-forms/core/service/dynamic-form-layout.service';
import { DynamicFormValidationService } from '@ng-dynamic-forms/core/service/dynamic-form-validation.service';



@Component({
  selector: 'dynamic-ng-bootstrap-rating',
  templateUrl: './dynamic-ng-bootstrap-rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgbRatingModule,
    NgClass,
    ReactiveFormsModule,
  ],
})
export class DynamicNGBootstrapRatingComponent extends DynamicFormControlComponent {
    @Input() formLayout?: DynamicFormLayout;
    @Input() group!: UntypedFormGroup;
    @Input() layout?: DynamicFormControlLayout;
    @Input() model!: DynamicRatingModel;

    @Output() blur: EventEmitter<any> = new EventEmitter();
    @Output() change: EventEmitter<any> = new EventEmitter();
    @Output() customEvent: EventEmitter<DynamicFormControlCustomEvent> = new EventEmitter();
    @Output() focus: EventEmitter<any> = new EventEmitter();

    @ViewChild(NgbRating, { static: true }) ngbRating!: NgbRating;

    constructor(protected layoutService: DynamicFormLayoutService,
                protected validationService: DynamicFormValidationService,
                public config: NgbRatingConfig) {
      super(layoutService, validationService);
    }
}
