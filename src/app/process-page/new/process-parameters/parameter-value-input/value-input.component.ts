import { EventEmitter, Output } from '@angular/core';

export abstract class ValueInputComponent<T> {
  @Output() updateValue: EventEmitter<T> = new EventEmitter<T>()
}
