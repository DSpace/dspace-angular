import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BaseMetricComponent } from './base-metric.component';
import { DomSanitizer } from '@angular/platform-browser';

export const METRIC_SCRIPT_TIMEOUT_MS = 500;
export const METRIC_SCRIPT_MAX_ATTEMPT = 3;

/**
 * The BaseEmbeddedMetricComponent enhance the basic metric component taking care to run the script required
 * to initialize the dynamically added html snippet.
 */
@Component({
  template: '',
})
export abstract class BaseEmbeddedMetricComponent extends BaseMetricComponent implements OnInit, AfterViewInit {

  /**
   * Give a context to the script (if supported) to target the metric initialization.
   */
  @ViewChild('metricChild', {static: false}) metricChild;

  sanitizedInnerHtml;

  attempts = 0;

  protected constructor(protected sr: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.sanitizedInnerHtml = this.sr.bypassSecurityTrustHtml(this.metric.remark);
  }

  /**
   * When the html content has been initialized, initialize the script.
   */
  ngAfterViewInit() {
    if (this.metric) {
      this.initScript();
    }
  }

  /**
   * Wait for the script to be loaded and then apply the script.
   * If the script is not loaded yet waits and retries.
   * @protected
   */
  protected initScript() {
    if (this.attempts === METRIC_SCRIPT_MAX_ATTEMPT) {
      console.warn('Script load retry count exceeded max');
      return;
    }
    try {
      this.scriptIsLoaded();
    } catch (error) {
      setTimeout(() => this.initScript(), METRIC_SCRIPT_TIMEOUT_MS);
      return;
    }

    this.applyScript();
    this.attempts++;
  }

  /**
   * Check whether the script is loaded. Throws an Error if not.
   */
  abstract scriptIsLoaded();

  /**
   * Apply the script.
   */
  abstract applyScript();

}
