import { Component, OnInit } from '@angular/core';

@Component({
  templateUrl: './external-login-validation-page.component.html',
  styleUrls: ['./external-login-validation-page.component.scss']
})
export class ExternalLoginValidationPageComponent implements OnInit {

  // temporary variable to test the component
  newEmail = false;

  existingEmail = true;

  ngOnInit(): void {
    // GET data from validation link
    // -> if email address is not used by other user => Email Validated component
    // -> if email address is used by other user => Review account information component
    console.log('ExternalLoginValidationPageComponent ngOnInit');
  }

}
