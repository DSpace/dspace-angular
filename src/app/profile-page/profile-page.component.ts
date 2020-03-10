import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { EPerson } from '../core/eperson/models/eperson.model';
import { select, Store } from '@ngrx/store';
import { getAuthenticatedUser } from '../core/auth/selectors';
import { AppState } from '../app.reducer';
import { ProfilePageMetadataFormComponent } from './profile-page-metadata-form/profile-page-metadata-form.component';

@Component({
  selector: 'ds-profile-page',
  templateUrl: './profile-page.component.html'
})
/**
 * Component for a user to edit their profile information
 */
export class ProfilePageComponent implements OnInit {

  @ViewChild(ProfilePageMetadataFormComponent, { static: false }) metadataForm: ProfilePageMetadataFormComponent;

  /**
   * The authenticated user
   */
  user$: Observable<EPerson>;

  constructor(private store: Store<AppState>) {
  }

  ngOnInit(): void {
    this.user$ = this.store.pipe(select(getAuthenticatedUser));
  }

  updateProfile() {
    this.metadataForm.updateProfile();
  }
}
