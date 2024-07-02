import { NgIf } from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { getHomePageRoute } from '../../../app-routing-paths';
import { AuthService } from '../../../core/auth/auth.service';
import { RemoteData } from '../../../core/data/remote-data';
import { EPerson } from '../../../core/eperson/models/eperson.model';
import { FeedbackDataService } from '../../../core/feedback/feedback-data.service';
import { RouteService } from '../../../core/services/route.service';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../core/services/window.service';
import { NoContent } from '../../../core/shared/NoContent.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { URLCombiner } from '../../../core/url-combiner/url-combiner';
import { ErrorComponent } from '../../../shared/error/error.component';
import { NotificationsService } from '../../../shared/notifications/notifications.service';

@Component({
  selector: 'ds-base-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgIf, ErrorComponent, TranslateModule],
})
/**
 * Component displaying the contents of the Feedback Statement
 */
export class FeedbackFormComponent implements OnInit {

  /**
   * Form builder created used from the feedback from
   */
  feedbackForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    message: ['', Validators.required],
    page: [''],
  });

  constructor(
    @Inject(NativeWindowService) protected _window: NativeWindowRef,
    public routeService: RouteService,
    private fb: UntypedFormBuilder,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    private feedbackDataService: FeedbackDataService,
    private authService: AuthService,
    private router: Router) {
  }

  /**
   * On init check if user is logged in and use its email if so
   */
  ngOnInit() {

    this.authService.getAuthenticatedUserFromStore().pipe(take(1)).subscribe((user: EPerson) => {
      if (user) {
        this.feedbackForm.patchValue({ email: user.email });
      }
    });

    this.routeService.getPreviousUrl().pipe(take(1)).subscribe((url: string) => {
      if (!url) {
        url = getHomePageRoute();
      }
      const relatedUrl = new URLCombiner(this._window.nativeWindow.origin, url).toString();
      this.feedbackForm.patchValue({ page: relatedUrl });
    });

  }

  /**
   * Function to create the feedback from form values
   */
  createFeedback(): void {
    const url = this.feedbackForm.value.page.replace(this._window.nativeWindow.origin, '');
    this.feedbackDataService.create(this.feedbackForm.value).pipe(getFirstCompletedRemoteData()).subscribe((response: RemoteData<NoContent>) => {
      if (response.isSuccess) {
        this.notificationsService.success(this.translate.instant('info.feedback.create.success'));
        this.feedbackForm.reset();
        this.router.navigateByUrl(url);
      }
    });
  }

}
