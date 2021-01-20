import { Injectable } from '@angular/core';
import { of } from 'rxjs/internal/observable/of';

declare var document: any;

interface Script {
  loaded: boolean;
  src: string
}

@Injectable({providedIn: 'root'})
export class MetricDynamicScriptLoaderService {

  private scripts: { [metricType: string]: Script } = {};

  protected loadScript(metricType: string, src: string): Promise<any> {
    console.log('Loading script of', metricType)
    return new Promise((resolve, reject) => {
      if (this.scripts[metricType] && this.scripts.loaded) {
        console.log('Resolving with status Already Loaded');
        resolve({metricType, loaded: true, status: 'Already Loaded'});
      } else {
        // load script
        this.scripts[metricType] = {
          loaded: false, src
        }
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        if (script.readyState) {  // IE
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.scripts[metricType].loaded = true;
              console.log('Resolving with status Loaded');
              resolve({metricType, loaded: true, status: 'Loaded'});
            }
          };
        } else {  // Others
          script.onload = () => {
            this.scripts[metricType].loaded = true;
            console.log('Resolving with status Loaded');
            resolve({metricType, loaded: true, status: 'Loaded'});
          };
        }
        script.onerror = (error: any) => {
          console.log('Resolving with status Error');
          resolve({metricType, loaded: false, status: 'Loaded'});
        };
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }

  /**
   * Load the required metric script.
   * @param metricType
   * @param src
   */
  public loadMetricScript(metricType: string, src: string): Promise<any> {
    if (src) {
      return this.loadScript(metricType, src);
    }
    return of(null).toPromise();
  }

}
