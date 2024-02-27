import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MathJaxConfig, MathService } from './math.service';

@Injectable({
  providedIn: 'root'
})
export class ClientMathService extends MathService {

  protected signal: Subject<boolean>;

  protected mathJaxOptions = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']]
    },
    svg: {
      fontCache: 'global'
    },
    startup: {
      typeset: false
    }
  };

  protected mathJax: MathJaxConfig = {
    source: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
    id: 'MathJaxScript'
  };
  protected mathJaxFallback: MathJaxConfig = {
    source: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-chtml.min.js',
    id: 'MathJaxBackupScript'
  };

  constructor() {
    super();

    this.signal = new ReplaySubject<boolean>();

    void this.registerMathJaxAsync(this.mathJax)
      .then(() => this.signal.next(true))
      .catch(_ => {
        void this.registerMathJaxAsync(this.mathJaxFallback)
          .then(() => this.signal.next(true))
          .catch((error) => console.log(error));
      });
  }

  protected async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
    if (environment.markdown.mathjax) {
      return new Promise<void>((resolve, reject) => {

        const optionsScript: HTMLScriptElement = document.createElement('script');
        optionsScript.type = 'text/javascript';
        optionsScript.text = `MathJax = ${JSON.stringify(this.mathJaxOptions)};`;
        document.head.appendChild(optionsScript);

        const script: HTMLScriptElement = document.createElement('script');
        script.id = config.id;
        script.type = 'text/javascript';
        script.src = config.source;
        script.crossOrigin = 'anonymous';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = error => reject(error);
        document.head.appendChild(script);
      });
    }
    return Promise.resolve();
  }

  ready(): Observable<boolean> {
    return this.signal;
  }

  render(element: HTMLElement) {
    if (environment.markdown.mathjax) {
      (window as any).MathJax.typesetPromise([element]);
    }
  }
}
