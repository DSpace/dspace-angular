import {
  Component,
  Input,
} from '@angular/core';

// noinspection AngularMissingOrInvalidDeclarationInModule
@Component({
  selector: 'ds-test-component',
  template: '',
})
export class TestComponent {
  @Input() type = 'default';
  @Input() testInput = 'unset';
}
