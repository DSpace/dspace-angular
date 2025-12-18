export interface DynamicValidatorDescriptor {
    name: string;
    args: any;
}
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export interface DynamicValidatorsConfig { [validatorKey: string]: any | DynamicValidatorDescriptor }

export enum DynamicFormHook {
    Blur = 'blur',
    Change = 'change',
    Submit = 'submit'
}
