import { Observable } from 'rxjs';

export interface MathJaxConfig {
  source: string;
  id: string;
}

/**
 * This service is used to provide the MathJax library with the ability to render markdown code
 */
export abstract class MathService {
  protected abstract mathJaxOptions: any;
  protected abstract mathJax: MathJaxConfig;
  protected abstract mathJaxFallback: MathJaxConfig;

  protected abstract registerMathJaxAsync(config: MathJaxConfig): Promise<any>;
  abstract ready(): Observable<boolean>;
  abstract render(element: HTMLElement): void;
}
