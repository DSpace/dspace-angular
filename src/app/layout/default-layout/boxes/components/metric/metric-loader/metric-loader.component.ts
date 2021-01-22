import { Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Metric } from '../../../../../../core/shared/metric.model';
import { BaseMetricComponent } from './base-metric.component';
import { MetricLoaderService } from './metric-loader.service';

@Component({
  selector: 'ds-metric-loader',
  templateUrl: './metric-loader.component.html',
  styleUrls: ['./metric-loader.component.scss']
})
export class MetricLoaderComponent implements OnInit {

  @Input() metric: Metric;

  @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private metricLoaderService: MetricLoaderService) { }

  ngOnInit() {
    this.loadComponent(this.metric);
  }

  loadComponent(metric: Metric) {
    if (!metric) {
      return;
    }
    this.metricLoaderService.loadMetricTypeComponent(metric.metricType).then((component) => {
      this.instantiateComponent(component, metric);
    })
  }

  instantiateComponent(component: any, metric: Metric) {
    const factory =    this.componentFactoryResolver.resolveComponentFactory(component);
    const ref = this.container.createComponent(factory);
    const componentInstance = (ref.instance as BaseMetricComponent);
    componentInstance.metric = metric;
    ref.changeDetectorRef.detectChanges();
  }

}
