import { Inject, Injectable, RendererFactory2, ViewEncapsulation } from '@angular/core';

import { INITIAL_CONFIG, PlatformState } from '@angular/platform-server';

import { TransferState } from './transfer-state';

@Injectable()
export class ServerTransferState extends TransferState {

  constructor(private state: PlatformState, private rendererFactory: RendererFactory2) {
    super();
  }

  inject() {
    try {
      const document: any = this.state.getDocument();
      const transferStateString = JSON.stringify(this.toJson());
      const renderer = this.rendererFactory.createRenderer(document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });
      const head = document.children[1].children[0];
      if (head.name !== 'head') {
        throw new Error('Please have <head> as the first element in your document');
      }
      const script = renderer.createElement('script');
      renderer.setValue(script, `window['TRANSFER_STATE'] = ${transferStateString}`);
      renderer.appendChild(head, script);
    } catch (e) {
      console.error(e);
    }

  }

}
