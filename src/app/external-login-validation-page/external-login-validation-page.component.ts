import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertType } from '../shared/alert/aletr-type';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  templateUrl: './external-login-validation-page.component.html',
  styleUrls: ['./external-login-validation-page.component.scss'],
})
export class ExternalLoginValidationPageComponent implements OnInit {
  /**
   * The type of alert to show
   */
  public AlertTypeEnum = AlertType;

  /**
   * Whether the component has errors
   */
  private validationFailed: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    private arouter: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.arouter.data.subscribe((data) => {
      const resolvedData = data.createUser;
      this.validationFailed.next(!resolvedData);
    });

        // TODO: remove this line (temporary)
    this.validationFailed.next(false);
  }


  /**
   * Check if the validation has failed
   */
  public hasFailed(): Observable<boolean> {
    return this.validationFailed.asObservable();
  }
}
