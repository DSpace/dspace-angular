import { Injectable } from '@angular/core';

export enum METRIC_SCRIPT_ENUM {
  DIMENSIONS = 'dimensions',
  ALTMETRICS = 'altmetric'
}

interface Scripts {
  name: METRIC_SCRIPT_ENUM;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: METRIC_SCRIPT_ENUM.ALTMETRICS, src: 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js' },
  { name: METRIC_SCRIPT_ENUM.DIMENSIONS, src: 'https://badge.dimensions.ai/badge.js' }
];

declare var document: any;

@Injectable({providedIn: 'root'})
export class MetricDynamicScriptLoaderService {

  private scripts: any = {};

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  protected load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  protected loadScript(name: string): Promise<any> {
    console.log('Loading script of', name)
    return new Promise((resolve, reject) => {
      if (!this.scripts[name].loaded) {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  // IE
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              console.log('Resolving with status Loaded');
              resolve({script: name, loaded: true, status: 'Loaded'});
            }
          };
        } else {  // Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            console.log('Resolving with status Loaded');
            resolve({script: name, loaded: true, status: 'Loaded'});
          };
        }
        script.onerror = (error: any) => {
          console.log('Resolving with status Error');
          return resolve({script: name, loaded: false, status: 'Loaded'});
        };
        document.getElementsByTagName('head')[0].appendChild(script);
      } else {
        console.log('Resolving with status Already Loaded');
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      }
    });
  }

  public loadMetricScript(metricType: string): Promise<any> {
    if (metricType === METRIC_SCRIPT_ENUM.DIMENSIONS) {
      return this.loadScript('dimensions');
    }
    if (metricType === METRIC_SCRIPT_ENUM.ALTMETRICS) {
      return this.loadScript('altmetric');
    }
    console.warn('no mapped script found for', metricType);
    return Promise.resolve();
  }

}
