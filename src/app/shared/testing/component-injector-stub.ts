import { ComponentFactory } from '@angular/core';
import { create } from 'domain';

export class ComponentInjectorStub {
  resolveComponentFactory(): ComponentFactory<any> {
    return {
      create() {
        return { hostView: {}, viewContainerParent: {},  }
      }
    } as any;
  }
}