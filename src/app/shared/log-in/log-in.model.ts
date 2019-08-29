export class DynamicLoginMethod {
  label: string;
  component: any;
  location?: string;

  constructor(label, component, location?) {
    this.label = label;
    this.component = component;
    this.location = location;
  }
}
