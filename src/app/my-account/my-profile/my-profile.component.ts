import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthFacadeApiService } from 'src/app/commons/facade/auth-api-facade.service';
import { ProfileApiFacadeService } from 'src/app/commons/facade/profile-api-facade.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  isEdit: boolean = false;
  profileForm: FormGroup;
  socialLogin: boolean= false;
  changePasswordClick: boolean = false;
  constructor(private profileFacadeService: ProfileApiFacadeService,
    private fb: FormBuilder,
    private profileApiFacadeService : ProfileApiFacadeService,
    private route : Router,
    private authservice: AuthFacadeApiService,) {
    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      address: '',
      city: '',
      country: '',
      first_name: '',
      last_name: '',
      phone: '',
      postal_code: '',
      social_id: '',
    });
  }
  ngOnInit(): void {
    this.profileFacadeService.profileGet().pipe().subscribe((data) => {
      if (!!data) {
        this.profileForm.get('email').setValue(data['data'].email === null ? '':data['data'].email);
        this.profileForm.get('password').setValue(data['data'].password === null ? '':data['data'].password);
        this.profileForm.get('address').setValue(data['data'].address === null ? '':data['data'].address);
        this.profileForm.get('city').setValue(data['data'].city === null ? '':data['data'].city);
        this.profileForm.get('country').setValue(data['data'].country === null ? '':data['data'].country);
        this.profileForm.get('first_name').setValue(data['data'].first_name === null ? '':data['data'].first_name);
        this.profileForm.get('last_name').setValue(data['data'].last_name === null ? '':data['data'].last_name);
        this.profileForm.get('phone').setValue(data['data'].phone === null ? '':data['data'].phone);
        this.profileForm.get('postal_code').setValue(data['data'].postal_code === null ? '':data['data'].postal_code);
        this.socialLogin = data['data'].login_type === 0 ? true : false
      }
    });
    // throw new Error('Method not implemented.');
  }

  onSubmit() {
    this.profileApiFacadeService.profilePatch(this.profileForm.value).pipe().subscribe((data) => {
         if(data['status'] === 1) {
          this.profileForm.get('email').setValue(data['data'].email === null ? '':data['data'].email);
          this.profileForm.get('address').setValue(data['data'].address === null ? '':data['data'].address);
          this.profileForm.get('city').setValue(data['data'].city === null ? '':data['data'].city);
          this.profileForm.get('country').setValue(data['data'].country === null ? '':data['data'].country);
          this.profileForm.get('first_name').setValue(data['data'].first_name === null ? '':data['data'].first_name);
          this.profileForm.get('last_name').setValue(data['data'].last_name === null ? '':data['data'].last_name);
          this.profileForm.get('phone').setValue(data['data'].phone === null ? '':data['data'].phone);
          this.profileForm.get('postal_code').setValue(data['data'].postal_code === null ? '':data['data'].postal_code);
          this.cancel();
         }

    });
  }

  edit() {
    this.isEdit = !this.isEdit;
  }

  cancel() {
    this.isEdit = !this.isEdit;
  }

  changePassword() {
    this.changePasswordClick = !this.changePasswordClick;
  }

  sendEmail() {
    let data = {
      'email' : this.profileForm.value.email
    }
    this.authservice.authForgotPasswordPost(data).pipe().subscribe((response) => {

    });
  }

}
