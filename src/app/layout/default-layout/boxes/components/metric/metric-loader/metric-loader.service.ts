import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { MetricAltmetricComponent } from '../metric-altmetric/metric-altmetric.component';
import { MetricDimensionsComponent } from '../metric-dimensions/metric-dimensions.component';
import { MetricGooglescholarComponent } from '../metric-googlescholar/metric-googlescholar.component';
import { MetricDspacecrisComponent } from '../metric-dspacecris/metric-dspacecris.component';

declare var document: any;

interface Script {
  loaded: boolean;
  src: string;
}

export interface MetricTypeConf {
  id: string;
  component: any;
  script: string;
}

export const MetricTypesConfig: MetricTypeConf[] = [
  {
    id: 'altmetric',
    component: MetricAltmetricComponent,
    script: 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js'
  },
  {
    id: 'dimensions',
    component: MetricDimensionsComponent,
    script: 'https://badge.dimensions.ai/badge.js'
  },
  {
    id: 'googleScholar',
    component: MetricGooglescholarComponent,
    script: null
  }
];

@Injectable({providedIn: 'root'})
export class MetricLoaderService {

  protected metricTypesConfig = MetricTypesConfig;

  protected scripts: { [metricType: string]: Script } = {};

  /**
   * Load required data for the metricType and then return the Component type.
   * @param metricType
   * @return the ComponentClass for the metricType
   */
  public loadMetricTypeComponent(metricType: string): Promise<any> {
    const component = this.getComponent(metricType);
    const scriptSrc = this.getScript(metricType);
    if (scriptSrc) {
      return this.loadScript(metricType, scriptSrc).then(() => component);
    }
    return of(component).toPromise();
  }

  /**
   * Get the Component to use for the metric type.
   * @param metricType
   */
  protected getComponent(metricType: string): any {
    const config: MetricTypeConf = this.metricTypesConfig.find((conf) => conf.id === metricType);
    if (config) {
      return config.component;
    }
    return MetricDspacecrisComponent;
  }

  /**
   * Get the Script to run for the metric type.
   * @param metricType
   */
  protected getScript(metricType: string): string {
    const config: MetricTypeConf = this.metricTypesConfig.find((conf) => conf.id === metricType);
    if (config) {
      return config.script;
    }
    return null;
  }

  protected loadScript(metricType: string, src: string): Promise<any> {
    console.log('Loading script of', metricType);
    return new Promise((resolve, reject) => {
      if (this.scripts[metricType] && this.scripts.loaded) {
        console.log('Resolving with status Already Loaded');
        resolve({metricType, loaded: true, status: 'Already Loaded'});
      } else {
        // load script
        this.scripts[metricType] = {
          loaded: false, src
        };
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

}
