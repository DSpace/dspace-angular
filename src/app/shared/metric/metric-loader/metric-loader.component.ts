import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Metric } from '../../../core/shared/metric.model';
import { BaseMetricComponent } from './base-metric.component';
import { MetricLoaderService } from './metric-loader.service';
import { hasValue } from '../../empty.util';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ds-metric-loader',
  templateUrl: './metric-loader.component.html',
  styleUrls: ['./metric-loader.component.scss'],
})
export class MetricLoaderComponent implements OnInit, OnDestroy {

  @Input() metric: Metric;

  @Input() hideLabel = false;

  @ViewChild('container', { read: ViewContainerRef, static: false }) container: ViewContainerRef;

  @Input() isListElement = false;

  @Output() hide: EventEmitter<boolean> = new EventEmitter();

  public componentType: any;

  isVisible$: BehaviorSubject<boolean> = new BehaviorSubject(true);

  subscription: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private metricLoaderService: MetricLoaderService
  ) { }

  ngOnInit() {
    this.loadComponent(this.metric);
  }

  loadComponent(metric: Metric) {
    if (!metric) {
      return;
    }
    this.metricLoaderService.loadMetricTypeComponent(metric.metricType).then((component) => {
      this.instantiateComponent(component, metric);
    });
  }

  instantiateComponent(component: any, metric: Metric) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.componentType = component;
    const ref = this.container.createComponent(factory);
    const componentInstance = ref.instance as BaseMetricComponent;
    componentInstance.metric = metric;
    componentInstance.hideLabel = this.hideLabel;
    componentInstance.isListElement = this.isListElement;

    this.subscription = componentInstance.hide.subscribe((event) => {
      this.isVisible$.next(!event);
      this.hide.emit(event);
    });

    ref.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    if (hasValue(this.subscription)) {
      this.subscription.unsubscribe();
    }
  }
}
