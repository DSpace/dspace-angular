import { TestBed } from '@angular/core/testing';
import {
  Observable,
  of,
} from 'rxjs';

import {
  MathJaxConfig,
  MathService,
} from './math.service';

export class MockMathService extends MathService {
  protected mathJaxOptions: any = {};
  protected mathJax: MathJaxConfig = { source: '', id: '' };
  protected mathJaxFallback: MathJaxConfig = { source: '', id: '' };

  protected registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
    return Promise.resolve();
  }

  ready(): Observable<boolean> {
    return of(true);
  }

  render(element: HTMLElement): Promise<any> {
    return Promise.resolve();
  }
}

describe('MathService', () => {
  let service: MockMathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new MockMathService();
    spyOn(service, 'render');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be ready', (done) => {
    service.ready().subscribe(isReady => {
      expect(isReady).toBe(true);
      done();
    });
  });

  it('should render', () => {
    service.render(document.createElement('div'));
    expect(service.render).toHaveBeenCalled();
  });
});
