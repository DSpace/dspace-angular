import { Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { hasValue } from '../../empty.util';
import { Subscription } from 'rxjs/internal/Subscription';
import { FormControl, FormGroup } from '@angular/forms';

export class BrowseByStartsWithAbstractComponent implements OnInit, OnDestroy {
  startsWith: string;

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
        this.startsWith = params.startsWith;
      })
    );
    this.formData = new FormGroup({
      startsWith: new FormControl()
    });
  }

  setStartsWith(event: Event) {
    this.startsWith = (event.target as HTMLInputElement).value;
    this.setStartsWithParam();
  }

  setStartsWithParam() {
    if (this.startsWith === '-1') {
      this.startsWith = undefined;
    }
    this.router.navigate([], {
      queryParams: Object.assign({ startsWith: this.startsWith }),
      queryParamsHandling: 'merge'
    });
  }

  submitForm(data) {
    this.startsWith = data.startsWith;
    this.setStartsWithParam();
  }

  ngOnDestroy(): void {
    this.subs.filter((sub) => hasValue(sub)).forEach((sub) => sub.unsubscribe());
  }
}
