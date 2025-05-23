import {
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Subscription } from 'rxjs';

import { PaginationService } from '../../core/pagination/pagination.service';
import { hasValue } from '../empty.util';
import { StartsWithType } from './starts-with-type';

/**
 * An abstract component to render StartsWith options
 */
@Component({
  selector: 'ds-start-with-abstract',
  standalone: true,
  template: '',
})
export abstract class StartsWithAbstractComponent implements OnInit, OnDestroy {

  @Input() paginationId: string;

  @Input() startsWithOptions: (string | number)[];

  @Input() type: StartsWithType;

  /**
   * The currently selected startsWith in string format
   */
  startsWith: string;

  /**
   * The formdata controlling the StartsWith input
   */
  formData: UntypedFormGroup;

  /**
   * List of subscriptions
   */
  subs: Subscription[] = [];

  public constructor(
    protected paginationService: PaginationService,
    protected route: ActivatedRoute,
    protected router: Router,
  ) {
  }

  ngOnInit(): void {
    this.subs.push(
      this.route.queryParams.subscribe((params) => {
        if (hasValue(params.startsWith)) {
          this.setStartsWith(params.startsWith);
        }
      }),
    );
    this.formData = new UntypedFormGroup({
      startsWith: new UntypedFormControl(),
    });
  }

  /**
   * Get startsWith
   */
  getStartsWith(): any {
    return this.startsWith;
  }

  /**
   * Set the startsWith by string
   * @param startsWith
   */
  setStartsWith(startsWith: string) {
    this.startsWith = startsWith;
  }

  /**
   * Add/Change the url query parameter startsWith using the local variable
   */
  setStartsWithParam(resetPage = true) {
    if (this.startsWith === '-1') {
      this.startsWith = undefined;
    }
    if (resetPage) {
      this.paginationService.updateRoute(this.paginationId, { page: 1 }, { startsWith: this.startsWith });
    } else {
      void this.router.navigate([], {
        queryParams: Object.assign({ startsWith: this.startsWith }),
        queryParamsHandling: 'merge',
      });
    }
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
