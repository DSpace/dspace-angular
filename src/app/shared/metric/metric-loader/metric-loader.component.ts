import {
  Component,
  ComponentFactoryResolver,
  EventEmitter, Inject,
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
import { BrowserKlaroService } from '../../cookies/browser-klaro.service';
import { KlaroService } from '../../cookies/klaro.service';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';

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

  cookiesSubscription: Subscription;

  settingsSubscription: Subscription;

  private thirdPartyMetrics = ['plumX', 'altmetric', 'dimensions'];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private metricLoaderService: MetricLoaderService,
    private browserKlaroService: BrowserKlaroService,
    private cookies: KlaroService,
    private router: Router,
    @Inject(DOCUMENT) private _document: Document,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };
  }

  ngOnInit() {
    this.cookiesSubscription = this.browserKlaroService.getSavedPreferences().subscribe((preferences) => {
      const canLoadScript = (hasValue(preferences) && preferences.acknowledgement && this.thirdPartyMetrics.includes(this.metric.metricType))
        || !this.thirdPartyMetrics.includes(this.metric.metricType);

      this.loadComponent(this.metric, canLoadScript);
    });
  }

  loadComponent(metric: Metric, canLoadScript: boolean) {
    if (!metric) {
      return;
    }
    this.metricLoaderService.loadMetricTypeComponent(metric.metricType, canLoadScript).then((component) => {
      this.instantiateComponent(component, metric, canLoadScript);
    });
  }

  instantiateComponent(component: any, metric: Metric, canLoadScript: boolean) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.componentType = component;
    const ref = this.container.createComponent(factory);
    const componentInstance = ref.instance as BaseMetricComponent;
    componentInstance.metric = metric;
    componentInstance.hideLabel = this.hideLabel;
    componentInstance.isListElement = this.isListElement;
    componentInstance.canLoadScript = canLoadScript;


    if (!canLoadScript) {
      this.settingsSubscription = componentInstance.requestSettingsConsent.subscribe(() => {
        this.cookies.showSettings();
        //TODO: find a way to reload page once setting have been accepted also via footer
      });
    }

    this.subscription = componentInstance.hide.subscribe((event) => {
      this.isVisible$.next(!event);
      this.hide.emit(event);
    });

    ref.changeDetectorRef.detectChanges();
  }


  public refreshPageForMetricsBadge(): void {
    this.router.navigateByUrl(this.router.url);
  }


  ngOnDestroy(): void {
    if (hasValue(this.subscription)) {
      this.subscription.unsubscribe();
    }

    if (hasValue(this.settingsSubscription)) {
      this.settingsSubscription.unsubscribe();
    }

    this.cookiesSubscription.unsubscribe();
  }
}
