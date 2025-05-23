import { DOCUMENT } from '@angular/common';
import {
  Inject,
  Injectable,
} from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
} from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  NativeWindowRef,
  NativeWindowService,
} from '../services/window.service';
import {
  MathJaxConfig,
  MathService,
} from './math.service';

@Injectable({
  providedIn: 'root',
})
/**
 * Provide the MathService for CSR
 */
export class ClientMathService extends MathService {

  protected isReady$: Subject<boolean>;

  protected mathJaxOptions = {
    tex: {
      inlineMath: [['$', '$'], ['$$', '$$'], ['\\(', '\\)']],
    },
    svg: {
      fontCache: 'global',
    },
    startup: {
      typeset: false,
    },
  };

  protected mathJax: MathJaxConfig = {
    source: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
    id: 'MathJaxScript',
  };
  protected mathJaxFallback: MathJaxConfig = {
    source: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-chtml.min.js',
    id: 'MathJaxBackupScript',
  };

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
  ) {
    super();

    this.isReady$ = new BehaviorSubject<boolean>(false);

    void this.registerMathJaxAsync(this.mathJax)
      .then(() => this.isReady$.next(true))
      .catch(_ => {
        void this.registerMathJaxAsync(this.mathJaxFallback)
          .then(() => this.isReady$.next(true));
      });
  }

  /**
   * Register the specified MathJax script in the document
   *
   * @param config The configuration object for the script
   */
  protected async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
    if (environment.markdown.mathjax) {
      return new Promise<void>((resolve, reject) => {

        const optionsScript: HTMLScriptElement = this._document.createElement('script');
        optionsScript.type = 'text/javascript';
        optionsScript.text = `MathJax = ${JSON.stringify(this.mathJaxOptions)};`;
        this._document.head.appendChild(optionsScript);

        const script: HTMLScriptElement = this._document.createElement('script');
        script.id = config.id;
        script.type = 'text/javascript';
        script.src = config.source;
        script.crossOrigin = 'anonymous';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = error => reject(error);
        this._document.head.appendChild(script);
      });
    }
    return Promise.resolve();
  }

  /**
   * Return the status of the script registration
   */
  ready(): Observable<boolean> {
    return this.isReady$;
  }

  /**
   * Render the specified element using the MathJax JavaScript
   *
   * @param element The element to render with MathJax
   */
  render(element: HTMLElement) {
    if (environment.markdown.mathjax) {
      return (window as any).MathJax.typesetPromise([element]) as Promise<any>;
    }
  }
}
