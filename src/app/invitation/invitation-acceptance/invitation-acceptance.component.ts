import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Registration } from '../../core/shared/registration.model';
import { EpersonRegistrationService } from '../../core/data/eperson-registration.service';
import { getFirstCompletedRemoteData, getRemoteDataPayload } from '../../core/shared/operators';
import { EPersonDataService } from '../../core/eperson/eperson-data.service';
import { switchMap, take } from 'rxjs/operators';
import { EPerson } from '../../core/eperson/models/eperson.model';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'ds-invitation-acceptance',
  templateUrl: './invitation-acceptance.component.html',
  styleUrls: ['./invitation-acceptance.component.scss']
})
export class InvitationAcceptanceComponent implements OnInit {

  registrationData: Registration;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private epersonRegistrationService: EpersonRegistrationService,
              private epersonDataService: EPersonDataService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap((paramMap: ParamMap) => {
        const token = paramMap.get('registrationToken');
        return this.epersonRegistrationService.searchByTokenAndUpdateData(token);
      }),
      getFirstCompletedRemoteData(),
      getRemoteDataPayload()
    ).subscribe((registrationData: Registration) => {
      this.registrationData = registrationData;
    });
  }

  accept() {
    this.auth.getAuthenticatedUserFromStore().pipe(
      take(1),
      switchMap((eperson: EPerson) =>
         this.epersonDataService.acceptInvitationToJoinGroups(eperson.id, this.registrationData.token).pipe(
          getFirstCompletedRemoteData()
        )
      )
    ).subscribe(() => {
      this.navigateToHome();
    });
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
