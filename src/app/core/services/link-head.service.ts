import { Injectable, RendererFactory2, ViewEncapsulation, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class LinkHeadService {
  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document
  ) {

  }
  addTag(tag: LinkDefinition, forceCreation?: boolean) {

    try {
      const renderer = this.rendererFactory.createRenderer(this.document, {
        id: '-1',
        encapsulation: ViewEncapsulation.None,
        styles: [],
        data: {}
      });

      const link = renderer.createElement('link');

      const head = this.document.head;

      if (head === null) {
        throw new Error('<head> not found within DOCUMENT.');
      }

      Object.keys(tag).forEach((prop: string) => {
        return renderer.setAttribute(link, prop, tag[prop]);
      });

      renderer.appendChild(head, link);

    } catch (e) {
      console.error('Error within linkService : ', e);
    }
  }

  removeTag(attrSelector: string) {
    if (attrSelector) {
      try {
        const renderer = this.rendererFactory.createRenderer(this.document, {
          id: '-1',
          encapsulation: ViewEncapsulation.None,
          styles: [],
          data: {}
        });
        const head = this.document.head;
        if (head === null) {
          throw new Error('<head> not found within DOCUMENT.');
        }
        const linkTags = this.document.querySelectorAll('link[' + attrSelector + ']');
        for (const link of linkTags) {
          renderer.removeChild(head, link);
        }
      } catch (e) {
        console.log('Error while removing tag ' + e.message);
      }
    }
  }
}

export declare type LinkDefinition = {
  charset?: string;
  crossorigin?: string;
  href?: string;
  hreflang?: string;
  media?: string;
  rel?: string;
  rev?: string;
  sizes?: string;
  target?: string;
  type?: string;
} & {
    [prop: string]: string;
  };
