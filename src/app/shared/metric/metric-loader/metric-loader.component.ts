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
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { Metric } from '../../../core/shared/metric.model';
import { BaseMetricComponent } from './base-metric.component';
import { MetricLoaderService } from './metric-loader.service';
import { hasValue } from '../../empty.util';
import { CookieConsents, KlaroService } from '../../cookies/klaro.service';
import { startWith } from 'rxjs/operators';

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

  consentUpdates$: BehaviorSubject<CookieConsents>;

  subscription: Subscription;

  cookiesSubscription: Subscription;

  settingsSubscription: Subscription;

  private thirdPartyMetrics = ['plumX', 'altmetric', 'dimensions'];

  private hasLoadedScript: boolean;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private metricLoaderService: MetricLoaderService,
    private klaroService: KlaroService,
  ) {
    this.klaroService.watchConsentUpdates();
    this.consentUpdates$ = this.klaroService.consentsUpdates$;
  }

  ngOnInit() {
    this.cookiesSubscription = this.klaroService.getSavedPreferences().subscribe((consents) => {
      this.loadComponent(this.metric, this.getCanLoadScript(consents));
    });
  }

  loadComponent(metric: Metric, canLoadScript: boolean, forceRendering?: boolean) {
    if (!metric) {
      return;
    }
    this.hasLoadedScript = !!canLoadScript;
    this.metricLoaderService.loadMetricTypeComponent(metric.metricType, canLoadScript).then((component) => {
      this.instantiateComponent(component, metric, canLoadScript, forceRendering);
    });
  }

  /**
   * Instantiate component in view container
   *
   * @param component
   * @param metric
   * @param canLoadScript
   * @param forceRendering
   */

  instantiateComponent(component: any, metric: Metric, canLoadScript: boolean, forceRendering?: boolean) {
    const factory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.componentType = component;
    this.container.clear();

    const ref = this.container.createComponent(factory);
    const componentInstance = ref.instance as BaseMetricComponent;
    componentInstance.metric = metric;
    componentInstance.hideLabel = this.hideLabel;
    componentInstance.isListElement = this.isListElement;
    componentInstance.canLoadScript = canLoadScript;
    componentInstance.visibleWithoutData = forceRendering;

    if (!canLoadScript && !this.settingsSubscription) {
      this.reloadComponentOnConsentsChange(componentInstance, canLoadScript);
    }

    this.subscription = componentInstance.hide.subscribe((event) => {
      this.isVisible$.next(!event);
      this.hide.emit(event);
    });

    ref.changeDetectorRef.detectChanges();
  }

  /**
   * get condition to check if badge can load a script
   * @param consents
   */
  private getCanLoadScript(consents: CookieConsents): boolean {
    return (hasValue(consents) && consents[this.metric.metricType] && this.thirdPartyMetrics.includes(this.metric.metricType))
      || !this.thirdPartyMetrics.includes(this.metric.metricType);
  }

  /**
   * Listen to cookie consents change and reload component
   *
   * @param componentInstance
   * @param canLoadScript
   * @private
   */
  private reloadComponentOnConsentsChange(componentInstance: BaseMetricComponent, canLoadScript: boolean): void {
    if (hasValue(this.settingsSubscription)) {
      return;
    }

    this.settingsSubscription = combineLatest([
      this.consentUpdates$,
      componentInstance.requestSettingsConsent.pipe(startWith(undefined))
    ]).subscribe(([consents, request]) => {
      canLoadScript = this.getCanLoadScript(consents);

      if (request && !canLoadScript) {
        this.klaroService.showSettings();
      }

      if (canLoadScript && !this.hasLoadedScript) {
        this.loadComponent(this.metric, canLoadScript, true);
      }
    });
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
