import { Observable } from 'rxjs';

export interface MathJaxConfig {
  source: string;
  id: string;
}

export abstract class MathService {
  protected abstract mathJaxOptions: any;
  protected abstract mathJax: MathJaxConfig;
  protected abstract mathJaxFallback: MathJaxConfig;

  protected abstract registerMathJaxAsync(config: MathJaxConfig): Promise<any>;
  abstract ready(): Observable<boolean>;
  abstract render(element: HTMLElement): void;
}
