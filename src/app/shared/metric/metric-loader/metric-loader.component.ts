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
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { Metric } from '../../../core/shared/metric.model';
import { BaseMetricComponent } from './base-metric.component';
import { MetricLoaderService } from './metric-loader.service';
import { hasValue } from '../../empty.util';
import { BrowserKlaroService, CookieConsents } from '../../cookies/browser-klaro.service';
import { KlaroService } from '../../cookies/klaro.service';
import { distinctUntilChanged, startWith } from "rxjs/operators";

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

  consentUpdates$: BehaviorSubject<any>;

  subscription: Subscription;

  cookiesSubscription: Subscription;

  settingsSubscription: Subscription;

  private thirdPartyMetrics = ['plumX', 'altmetric', 'dimensions'];

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private metricLoaderService: MetricLoaderService,
    private browserKlaroService: BrowserKlaroService,
    private klaroService: KlaroService,
  ) {
    (this.klaroService as BrowserKlaroService).watchConsentUpdates();
    this.consentUpdates$ = (this.klaroService as BrowserKlaroService).consentsUpdates$;
  }

  ngOnInit() {
    this.cookiesSubscription = this.browserKlaroService.getSavedPreferences().subscribe((consents) => {
      this.loadComponent(this.metric, this.getCanLoadScript(consents));
    });
  }

  loadComponent(metric: Metric, canLoadScript: boolean, forceRendering?: boolean) {
    if (!metric) {
      return;
    }
    this.metricLoaderService.loadMetricTypeComponent(metric.metricType, canLoadScript).then((component) => {
      if(hasValue(this.cookiesSubscription) && canLoadScript) {
        this.container.clear();
        this.cookiesSubscription.unsubscribe()
      }
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
    const ref = this.container.createComponent(factory);
    const componentInstance = ref.instance as BaseMetricComponent;
    componentInstance.metric = metric;
    componentInstance.hideLabel = this.hideLabel;
    componentInstance.isListElement = this.isListElement;
    componentInstance.canLoadScript = canLoadScript;
    componentInstance.visibleWithoutData = forceRendering;


    if (!canLoadScript) {
      this.reloadComponentOnConsentsChange(componentInstance, canLoadScript)
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
  private getCanLoadScript(consents: CookieConsents) : boolean {
    return (hasValue(consents) && consents.acknowledgement && this.thirdPartyMetrics.includes(this.metric.metricType))
      || !this.thirdPartyMetrics.includes(this.metric.metricType);
  }

  /**
   * Listen to cookie consents change and reload component
   *
   * @param componentInstance
   * @param canLoadScript
   * @private
   */
  private reloadComponentOnConsentsChange(componentInstance: BaseMetricComponent, canLoadScript: boolean) : void {
    this.settingsSubscription = combineLatest([
      this.consentUpdates$.pipe(distinctUntilChanged(
        (previousConsents, currentConsents) => JSON.stringify(previousConsents) === JSON.stringify(currentConsents))
      ),
      componentInstance.requestSettingsConsent.pipe(startWith(undefined))
    ]).subscribe(([consents, request]) => {
      canLoadScript = this.getCanLoadScript(consents);

      if(request && !canLoadScript) {
        this.klaroService.showSettings();
      }

      if(canLoadScript) {
        this.loadComponent(this.metric, canLoadScript, true)
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
