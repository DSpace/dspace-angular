import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthFacadeApiService } from 'src/app/commons/facade/auth-api-facade.service';
import { HeaderService } from 'src/app/commons/services/Header/header.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/commons/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  show = false;
  password;

  constructor(private headerService: HeaderService, private fb: FormBuilder, private _snackBar: MatSnackBar,
    private authservice: AuthFacadeApiService,
    private authGuard: AuthService,
    private route: Router,
    private cdref : ChangeDetectorRef,
    private location1: Location) {
    this.headerService.hide = true; // Hide the header in HomeComponent
    this.loginForm = this.fb.group({
      email: [''],
      password: [''],
    });
    this.password = 'password';
  }

  back() {
    console.error();
    console.log('click');
    this.route.navigate(['/home']).then(() => {
      location.reload();
    });
    this.cdref.detectChanges();
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.valid) {

      this.authservice.authLoginPost(this.loginForm.value).pipe().subscribe((response) => {
        console.log(response);
        if (response.status === 1) {
          if (!!response.data) {
            localStorage.setItem('bearerAuth',response.data['id_token']);
            localStorage.setItem('user_id',response.data['user_id']);
            localStorage.setItem('userEmail',response.data['email']);
            localStorage.setItem('userFirstName',response.data['first_name']);
            localStorage.setItem('userLastName',response.data['last_name']);
            localStorage.setItem('loginavaliable',"true");
          }
          this.authGuard.notifyLogin();
          this.location1.back();
        }
        else if (response.status === 0) 
        {
          this._snackBar.open(response.message, 'Close', {
            horizontalPosition: "center",
            verticalPosition: "top",
            duration: 5 * 1000
          });
        }
      });
    }
  }

}
