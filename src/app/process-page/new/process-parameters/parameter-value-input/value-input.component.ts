import { EventEmitter, Output } from '@angular/core';

/**
 * Abstract class that represents value input components
 */
export abstract class ValueInputComponent<T> {
  /**
   * Used by the subclasses to emit the value when it's updated
   */
  @Output() updateValue: EventEmitter<T> = new EventEmitter<T>()
}
