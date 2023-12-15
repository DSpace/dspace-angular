import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacadeApiService } from 'src/app/commons/facade/auth-api-facade.service';
import { HeaderService } from 'src/app/commons/services/Header/header.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})

export class ResetPasswordComponent {
  loginForm: FormGroup;
  confirmPassword: FormControl = new FormControl('');
  error: boolean = false;
  constructor(private headerService: HeaderService,
    private fb: FormBuilder,
    private authservice: AuthFacadeApiService,
    private route: ActivatedRoute,
    private router: Router) {
    this.headerService.hide = true; // Hide the header in HomeComponent
    this.loginForm = this.fb.group({
      password: ['', [Validators.required]],
      forgotten_password_code: ['', [Validators.required]],
    });
  }

  onSubmit() {
    debugger
    console.log(this.confirmPassword);
    if (this.loginForm.value.password === this.confirmPassword.value) {
      // Passwords match, you can handle the form submission here.
      this.loginForm.value.forgotten_password_code = this.route.snapshot.paramMap.get('id');
      this.authservice.authResetPasswordPost(this.loginForm.value).pipe().subscribe((response) => {
        console.log(response);
        if (response.status === 1) {
          
          Swal.fire({
            title: "Reset Password",
            text: "Reset Password Successfully Updated",
            icon: "success"
          });
          this.router.navigate(['/login']);
        }
      });
    } else {
      this.error = true;
    }
  }
  back(){
    
    this.router.navigate(['/home']).then(() => {
      location.reload();
    });
  }
}
