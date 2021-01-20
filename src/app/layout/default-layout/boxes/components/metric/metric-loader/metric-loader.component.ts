import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Metric } from '../../../../../../core/shared/metric.model';
import { MetricAltmetricComponent } from '../metric-altmetric/metric-altmetric.component';
import { MetricDimensionsComponent } from '../metric-dimensions/metric-dimensions.component';
import { MetricDspacecrisComponent } from '../metric-dspacecris/metric-dspacecris.component';
import { BaseMetricComponent } from './base-metric.component';
import { MetricDynamicScriptLoaderService } from './metric-dynamic-script-loader.service';
import { MetricGooglescholarComponent } from '../metric-googlescholar/metric-googlescholar.component';

export const MetricTypeComponentConfig = {
  altmetric: {
    component: MetricAltmetricComponent,
    script: 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js'
  },
  dimensions: {
    component: MetricDimensionsComponent,
    script: 'https://badge.dimensions.ai/badge.js'
  },
  googleScholar: {
    component: MetricGooglescholarComponent,
    script: null
  }
}

@Component({
  selector: 'ds-metric-loader',
  templateUrl: './metric-loader.component.html',
  styleUrls: ['./metric-loader.component.scss']
})
export class MetricLoaderComponent implements OnInit {

  @Input() metric: Metric;

  @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private metricScriptLoaderService: MetricDynamicScriptLoaderService) { }

  ngOnInit() {
    this.loadComponent(this.metric);
  }

  loadComponent(metric: Metric) {
    if (!metric) {
      return;
    }

    const component = this.getComponent(metric.metricType);
    const scriptSrc = this.getScript(metric.metricType);
    this.metricScriptLoaderService.loadMetricScript(metric.metricType, scriptSrc).then(() => {
      const factory =    this.componentFactoryResolver.resolveComponentFactory(component);
      const ref = this.container.createComponent(factory);
      const componentInstance = (ref.instance as BaseMetricComponent);
      componentInstance.metric = metric;
      ref.changeDetectorRef.detectChanges();
    })
  }

  getComponent(metricType: string): any {
    const config = MetricTypeComponentConfig[metricType];
    if (config) {
      return config.component;
    }
    return MetricDspacecrisComponent;
  }

  getScript(metricType: string): string {
    const config = MetricTypeComponentConfig[metricType];
    if (config) {
      return config.script;
    }
    return null;
  }

}
