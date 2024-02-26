import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';

interface MathJaxConfig {
  source: string;
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class MathService {

  private signal: Subject<boolean>;

  private mathJaxOptions = {
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

  private mathJax: MathJaxConfig = {
    source: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
    id: 'MathJaxScript'
  };
  private mathJaxFallback: MathJaxConfig = {
    source: 'assets/mathjax/mml-chtml.js',
    id: 'MathJaxBackupScript'
  };

  constructor() {

    this.signal = new ReplaySubject<boolean>();

    void this.registerMathJaxAsync(this.mathJax)
      .then(() => this.signal.next(true))
      .catch(_ => {
        void this.registerMathJaxAsync(this.mathJaxFallback)
          .then(() => this.signal.next(true))
          .catch((error) => console.log(error));
      });
  }

  private async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
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

  ready(): Observable<boolean> {
    return this.signal;
  }

  render(element: HTMLElement) {
    (window as any).MathJax.typesetPromise([element]);
  }
}
