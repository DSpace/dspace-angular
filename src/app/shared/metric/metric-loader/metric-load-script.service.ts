import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Script } from './metric-types-config';

@Injectable({ providedIn: 'root' })
export class MetricLoadScriptService {
  protected scripts: { [metricType: string]: Script } = {};

  constructor(@Inject(DOCUMENT) private document: any) {}

  /**
   * Set the Script to run for the metric type.
   * @param metricType to which is attached the script
   * @param src to be set in dom
   */
  loadScript(metricType: string, src: string): Promise<any> {
    console.info('Loading script of', metricType);
    return new Promise((resolve, reject) => {
      if (this.scripts[metricType] && this.scripts.loaded) {
        console.info('Resolving with status Already Loaded');
        resolve({ metricType, loaded: true, status: 'Already Loaded' });
      } else {
        // load script
        this.scripts[metricType] = {
          loaded: false,
          src,
        };
        const script = this.document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        if (script.readyState) {
          // IE
          script.onreadystatechange = () => {
            if (
              script.readyState === 'loaded' ||
              script.readyState === 'complete'
            ) {
              script.onreadystatechange = null;
              this.scripts[metricType].loaded = true;
              console.info('Resolving with status Loaded');
              resolve({ metricType, loaded: true, status: 'Loaded' });
            }
          };
        } else {
          // Others
          script.onload = () => {
            this.scripts[metricType].loaded = true;
            console.info('Resolving with status Loaded');
            resolve({ metricType, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) => {
          console.info('Resolving with status Error');
          resolve({ metricType, loaded: false, status: 'Loaded' });
        };
        this.document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
