import {
  AfterViewInit,
  Directive,
  QueryList,
  TemplateRef,
} from '@angular/core';

import { DynamicTemplateDirective } from '../directive/dynamic-template.directive';
import { DynamicFormLayoutService } from '../service/dynamic-form-layout.service';
import { DynamicFormValidationService } from '../service/dynamic-form-validation.service';
import { isString } from '../utils/core.utils';
import { DynamicFormControlComponent } from './dynamic-form-control.component';
import { DynamicFormControlWithTemplate } from './dynamic-form-control-with-template-interface';

@Directive({
  standalone: true,
})// tslint:disable-next-line:directive-class-suffix
export abstract class DynamicFormControlWithTemplateComponent extends DynamicFormControlComponent
  implements DynamicFormControlWithTemplate, AfterViewInit {

  readonly templateDirectives!: Map<string, string>;

  templates?: QueryList<DynamicTemplateDirective> | DynamicTemplateDirective[];

  protected constructor(protected layoutService: DynamicFormLayoutService,
                          protected validationService: DynamicFormValidationService) {
    super(layoutService, validationService);
  }

  ngAfterViewInit() {
    this.layoutService
      .filterTemplatesByModel(this.model, this.templates)
      .forEach(template => this.bindTemplate(template));
  }

    abstract get viewChild(): any;

    abstract mapTemplate(template: DynamicTemplateDirective): DynamicTemplateDirective | TemplateRef<any>;

    bindTemplate(template: DynamicTemplateDirective) {
      if (isString(template.as) && this.templateDirectives.has(template.as)) {
        const property = this.templateDirectives.get(template.as) as string;

        this.viewChild[property] = this.mapTemplate(template);
      }
    }
}
