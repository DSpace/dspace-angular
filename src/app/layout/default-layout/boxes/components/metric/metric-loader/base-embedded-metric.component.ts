import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BaseMetricComponent } from './base-metric.component';
import { DomSanitizer } from '@angular/platform-browser';
import { take, takeUntil } from 'rxjs/operators';
import { interval } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { Subject } from 'rxjs/internal/Subject';

export const METRIC_SCRIPT_TIMEOUT_MS = 500;
export const METRIC_SCRIPT_MAX_RETRY = 3;

/**
 * The BaseEmbeddedMetricComponent enhance the basic metric component taking care to run the script required
 * to initialize the dynamically added html snippet.
 */
export abstract class BaseEmbeddedMetricComponent extends BaseMetricComponent implements OnInit, AfterViewInit {

  timeout = METRIC_SCRIPT_TIMEOUT_MS;
  maxRetry = METRIC_SCRIPT_MAX_RETRY;

  /**
   * Give a context to the script (if supported) to target the metric initialization.
   */
  @ViewChild('metricChild', {static: false}) metricChild;

  sanitizedInnerHtml;

  success = false;

  protected constructor(protected sr: DomSanitizer) {
    super();
  }

  ngOnInit() {
    if (this.metric && this.metric.remark) {
      this.sanitizedInnerHtml = this.sr.bypassSecurityTrustHtml(this.metric.remark);
    }
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
   * Attempt to apply the script.
   * @protected
   */
  initScript() {
    const successNotifier = new Subject<any>()
    interval(this.timeout).pipe(
      tap(() => this.applyScriptHandler(successNotifier)),
      take(this.maxRetry),
      takeUntil(successNotifier),
      ).subscribe({
        complete: () => {
          if (!this.success) {
            console.error('The script of type ' + this.metric.metricType + ' hasn\'t been initialized successfully');
          }
        }
    });
 }

  /**
   * Apply the script and set success true when no error occurs.
   * @param notifier emit and complete in case of success
   */
  applyScriptHandler(notifier: Subject<any>) {
    try {
      this.applyScript();
      this.success = true;
      notifier.next();
      notifier.complete();
    } catch (error) {
      console.log('Error applying script for ' + this.metric.metricType + '. Retry');
    }
  }

  /**
   * Apply the script.
   */
  abstract applyScript();

}
