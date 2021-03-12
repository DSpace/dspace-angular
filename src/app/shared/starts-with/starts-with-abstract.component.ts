import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { hasValue } from '../empty.util';

/**
 * An abstract component to render StartsWith options
 */
@Component({
  selector: 'ds-start-with-abstract',
  template: ''
})
export abstract class StartsWithAbstractComponent implements OnInit, OnDestroy {
  /**
   * The currently selected startsWith in string format
   */
  startsWith: string;

  /**
   * The formdata controlling the StartsWith input
   */
  formData: FormGroup;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  public constructor(@Inject('startsWithOptions') public startsWithOptions: any[],
                     protected route: ActivatedRoute,
                     protected router: Router) {
  }

  ngOnInit(): void {
    this.subs.push(
      this.route.queryParams.subscribe((params) => {
        if (hasValue(params.startsWith)) {
          this.setStartsWith(params.startsWith);
        }
      })
    );
    this.formData = new FormGroup({
      startsWith: new FormControl()
    });
  }

  /**
   * Get startsWith
   */
  getStartsWith(): any {
    return this.startsWith;
  }

  /**
   * Set the startsWith by event
   * @param event
   */
  setStartsWithEvent(event: Event) {
    this.startsWith = (event.target as HTMLInputElement).value;
    this.setStartsWithParam();
  }

  /**
   * Set the startsWith by string
   * @param startsWith
   */
  setStartsWith(startsWith: string) {
    this.startsWith = startsWith;
    this.setStartsWithParam();
  }

  /**
   * Add/Change the url query parameter startsWith using the local variable
   */
  setStartsWithParam() {
    if (this.startsWith === '-1') {
      this.startsWith = undefined;
    }
    this.router.navigate([], {
      queryParams: Object.assign({ startsWith: this.startsWith }),
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Submit the form data. Called when clicking a submit button on the form.
   * @param data
   */
  submitForm(data) {
    this.startsWith = data.startsWith;
    this.setStartsWithParam();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
