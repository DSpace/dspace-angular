import {
  ComponentRef,
  EventEmitter,
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  QueryList,
  Type,
  ViewContainerRef,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';

import {
  DynamicFormControlCustomEvent,
  DynamicFormControlEvent,
} from '../component/dynamic-form-control-event';
import { DynamicFormControl } from '../component/dynamic-form-control-interface';
import { DynamicTemplateDirective } from '../directive/dynamic-template.directive';
import { DynamicFormControlModel } from '../model/dynamic-form-control.model';
import { DynamicFormArrayGroupModel } from '../model/form-array/dynamic-form-array.model';
import {
  DynamicFormControlLayoutContext,
  DynamicFormControlLayoutPlace,
} from '../model/misc/dynamic-form-control-layout.model';
import {
  isFunction,
  isNumber,
} from '../utils/core.utils';
import { DynamicFormLayout } from './dynamic-form-layout.service';

export type DynamicFormControlRef = ComponentRef<DynamicFormControl>;
export type DynamicFormControlMapFn = (model: DynamicFormControlModel) => Type<DynamicFormControl> | null;

export const DYNAMIC_FORM_CONTROL_MAP_FN = new InjectionToken<DynamicFormControlMapFn>('DYNAMIC_FORM_CONTROL_MAP_FN');

export interface IDynamicFormControlContainer {
  context: DynamicFormArrayGroupModel | null;
  control: UntypedFormControl;
  group: UntypedFormGroup;
  layout?: DynamicFormLayout;
  model: DynamicFormControlModel;

  contentTemplateList?: QueryList<DynamicTemplateDirective>;
  inputTemplateList?: QueryList<DynamicTemplateDirective>;
  templates?: QueryList<DynamicTemplateDirective>;
  startTemplate?: DynamicTemplateDirective;
  endTemplate?: DynamicTemplateDirective;

  blur: EventEmitter<DynamicFormControlEvent>;
  change: EventEmitter<DynamicFormControlEvent>;
  focus: EventEmitter<DynamicFormControlEvent>;
  customEvent?: EventEmitter<DynamicFormControlEvent>;

  componentViewContainerRef: ViewContainerRef;

  readonly id: string;
  readonly hasFocus: boolean;
  readonly isInvalid: boolean;
  readonly isValid: boolean;
  readonly errorMessages: string[];
  readonly showErrorMessages: boolean;
  readonly hasLabel: boolean;
  readonly hasHint: boolean;
  readonly hint: string | null;
  readonly isCheckbox: boolean;

  markForCheck(): void;
  getClass(context: DynamicFormControlLayoutContext, place: DynamicFormControlLayoutPlace): string;

  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onChange($event: Event | DynamicFormControlEvent | any): void;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onBlur($event: FocusEvent | DynamicFormControlEvent | any): void;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  onFocus($event: FocusEvent | DynamicFormControlEvent | any): void;
  onCustomEvent($event: DynamicFormControlEvent | DynamicFormControlCustomEvent): void;

  onControlValueChanges(value: any): void;
  onModelValueUpdates(value: any): void;
  onModelDisabledUpdates(disabled: boolean): void;

  onLayoutOrModelChange(): void;
  onModelChange(): void;
  onGroupOrModelChange(): void;

  unsubscribe(): void;

  readonly componentType?: Type<DynamicFormControl> | null;
}

interface IDynamicFormComponent {
  // Core form properties
  group: UntypedFormGroup;
  model: any; // DynamicFormModel
  layout?: DynamicFormLayout;

  // Child components & templates
  components: QueryList<IDynamicFormControlContainer>;
  templates: QueryList<DynamicTemplateDirective>;

  // Events
  blur?: EventEmitter<DynamicFormControlEvent>;
  change?: EventEmitter<DynamicFormControlEvent>;
  focus?: EventEmitter<DynamicFormControlEvent>;

  // Methods
  trackByFn(_index: number, model: DynamicFormControlModel): string;

  markForCheck(): void;
  detectChanges(): void;

  onBlur($event: DynamicFormControlEvent): void;
  onChange($event: DynamicFormControlEvent): void;
  onFocus($event: DynamicFormControlEvent): void;
  onCustomEvent($event: DynamicFormControlEvent, customEventEmitter: EventEmitter<DynamicFormControlEvent>): void;
}

@Injectable({
  providedIn: 'root',
})
export class DynamicFormComponentService {
  private forms: IDynamicFormComponent[] = [];
  private formControls: { [key: string]: DynamicFormControlRef | DynamicFormControlRef[] } = {};
  // eslint-disable-next-line @typescript-eslint/no-shadow
  constructor(@Inject(DYNAMIC_FORM_CONTROL_MAP_FN) @Optional() private readonly DYNAMIC_FORM_CONTROL_MAP_FN: any) {
    this.DYNAMIC_FORM_CONTROL_MAP_FN = DYNAMIC_FORM_CONTROL_MAP_FN as DynamicFormControlMapFn;
  }

  getForms(): IterableIterator<IDynamicFormComponent> {
    return this.forms.values();
  }

  registerForm(component: IDynamicFormComponent): void {
    this.forms.push(component);
  }

  unregisterForm(component: IDynamicFormComponent): void {
    const indexOf = this.forms.indexOf(component);

    if (indexOf !== -1) {
      this.forms.splice(indexOf, 1);
    }
  }

  getFormControlRef(modelId: string, index?: number): DynamicFormControlRef | undefined {
    const ref: DynamicFormControlRef | DynamicFormControlRef[] = this.formControls[modelId];

    if (isNumber(index)) {
      return Array.isArray(ref) ? ref[index] : undefined;

    } else {
      return ref as DynamicFormControlRef;
    }
  }

  registerFormControl(model: DynamicFormControlModel, ref: DynamicFormControlRef, index?: number): void {
    if (isNumber(index)) { // threat model as array child
      const arrayRef: DynamicFormControlRef[] = this.formControls[model.id] as DynamicFormControlRef[] || [];

      if (Array.isArray(arrayRef)) {
        arrayRef.splice(index, 0, ref);
        this.formControls[model.id] = arrayRef;

      } else {
        console.warn(`registerFormControlRef is called with index for a non-array form control: ${model.id}`);
      }

    } else {
      this.formControls[model.id] = ref;
    }
  }

  unregisterFormControl(modelId: string, index?: number): void {
    const componentRef = this.formControls[modelId];

    if (isNumber(index)) {
      if (Array.isArray(componentRef) && componentRef[index] !== undefined) {
        componentRef.splice(index, 1);
      }

    } else if (componentRef !== undefined) {
      delete this.formControls[modelId];
    }
  }

  getCustomComponentType(model: DynamicFormControlModel): Type<DynamicFormControl> | null {
    return isFunction(this.DYNAMIC_FORM_CONTROL_MAP_FN) ? this.DYNAMIC_FORM_CONTROL_MAP_FN(model) : null;
  }
}
