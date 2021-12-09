import { FeedbackDataService } from './../../../core/feedback/feedback-data.service';
import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/core/services/route.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Feedback } from '../../../core/feedback/models/feedback.model';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { EPersonDataService } from 'src/app/core/eperson/eperson-data.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { EPerson } from '../../../core/eperson/models/eperson.model';

@Component({
  selector: 'ds-feedback-content',
  templateUrl: './feedback-content.component.html',
  styleUrls: ['./feedback-content.component.scss']
})
/**
 * Component displaying the contents of the Feedback Statement
 */
export class FeedbackContentComponent implements OnInit {

  feedbackForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
    message: ['', Validators.required],
    page: [''],
  });

  constructor(
    public routeService: RouteService,
    private fb: FormBuilder,
    protected notificationsService: NotificationsService,
    protected translate: TranslateService,
    private feedbackDataService: FeedbackDataService,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getAuthenticatedUserFromStore().subscribe((user: EPerson) => {
      if (!!user) {
        this.feedbackForm.patchValue({ email: user.email });
      }
    });
  }

  createFeedback() {
    this.feedbackDataService.createFeedback(this.feedbackForm.value).subscribe((response: Feedback) => {
      this.notificationsService.success(this.translate.instant('info.feedback.create.success'));
      this.feedbackForm.reset();
    });
  }

}
