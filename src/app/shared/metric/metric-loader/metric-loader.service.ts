import { Injectable } from '@angular/core';

import { of } from 'rxjs';

import { MetricAltmetricComponent } from '../metric-altmetric/metric-altmetric.component';
import { MetricDimensionsComponent } from '../metric-dimensions/metric-dimensions.component';
import { MetricGooglescholarComponent } from '../metric-googlescholar/metric-googlescholar.component';
import { MetricDefaultComponent } from '../metric-default/metric-default.component';
import { MetricEmbeddedViewComponent } from '../metric-embedded/metric-embedded-view/metric-embedded-view.component';
import {
  MetricEmbeddedDownloadComponent
} from '../metric-embedded/metric-embedded-download/metric-embedded-download.component';
import { MetricPlumxComponent } from '../metric-plumx/metric-plumx.component';
import { MetricLoadScriptService } from './metric-load-script.service';
import { MetricTypeConf, Script } from './metric-types-config';

export const MetricTypesConfig: MetricTypeConf[] = [
  {
    id: 'altmetric',
    component: MetricAltmetricComponent,
    script: 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js',
  },
  {
    id: 'dimensions',
    component: MetricDimensionsComponent,
    script: 'https://badge.dimensions.ai/badge.js',
  },
  {
    id: 'google-scholar',
    component: MetricGooglescholarComponent,
    script: null,
  },
  {
    id: 'embedded-view',
    component: MetricEmbeddedViewComponent,
    script: null,
  },
  {
    id: 'embedded-download',
    component: MetricEmbeddedDownloadComponent,
    script: null,
  },
  {
    id: 'plumX',
    component: MetricPlumxComponent,
    script: '',
  },
];

@Injectable({ providedIn: 'root' })
export class MetricLoaderService {
  protected metricTypesConfig = MetricTypesConfig;

  protected scripts: { [metricType: string]: Script } = {};

  constructor(private metricLoadScriptService: MetricLoadScriptService) {}

  /**
   * Load required data for the metricType and then return the Component type.
   * @param metricType
   * @param canLoadScript
   * @return the ComponentClass for the metricType
   */
  public loadMetricTypeComponent(metricType: string, canLoadScript = true): Promise<any> {
    const component = this.getComponent(metricType);
    const scriptSrc = this.getScript(metricType);
    if (scriptSrc && canLoadScript) {
      return this.metricLoadScriptService.loadScript(metricType, scriptSrc).then(() => component);
    }
    return of(component).toPromise();
  }

  /**
   * Get the Component to use for the metric type.
   * @param metricType
   */
  protected getComponent(metricType: string): any {
    const config = this.metricTypesConfig.find((conf) => conf.id === metricType);
    if (config) {
      return config.component;
    }
    return MetricDefaultComponent;
  }

  /**
   * Get the Script to run for the metric type.
   * @param metricType
   */
  protected getScript(metricType: string): string {
    const config = this.metricTypesConfig.find(
      (conf) => conf.id === metricType
    );
    if (config) {
      return config.script;
    }
    return null;
  }
}
