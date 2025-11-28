import { serializable } from '../../decorator/serializable.decorator';
import {
  DynamicInputControlModel,
  DynamicInputControlModelConfig,
} from '../dynamic-input-control.model';
import { DynamicFormControlLayout } from '../misc/dynamic-form-control-layout.model';

export const DYNAMIC_FORM_CONTROL_TYPE_EDITOR = 'EDITOR';
// eslint-disable-next-line  @typescript-eslint/no-empty-object-type
export interface DynamicEditorModelConfig extends DynamicInputControlModelConfig<string> {
}

export class DynamicEditorModel extends DynamicInputControlModel<string> {
    @serializable() readonly type: string = DYNAMIC_FORM_CONTROL_TYPE_EDITOR;

    constructor(config: DynamicEditorModelConfig, layout?: DynamicFormControlLayout) {
      super(config, layout);
    }
}
