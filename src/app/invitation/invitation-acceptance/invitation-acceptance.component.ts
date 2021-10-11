import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Registration} from '../../core/shared/registration.model';
import {EpersonRegistrationService} from '../../core/data/eperson-registration.service';
import {getFirstCompletedRemoteData} from '../../core/shared/operators';
import {EPersonDataService} from '../../core/eperson/eperson-data.service';
import {take} from 'rxjs/operators';
import {EPerson} from '../../core/eperson/models/eperson.model';
import {AuthService} from '../../core/auth/auth.service';

@Component({
  selector: 'ds-invitation-acceptance',
  templateUrl: './invitation-acceptance.component.html',
  styleUrls: ['./invitation-acceptance.component.scss']
})
export class InvitationAcceptanceComponent implements OnInit {
  token: string;
  registrationData: Registration;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private epersonRegistrationService: EpersonRegistrationService,
              private epersonDataService: EPersonDataService,
              private auth: AuthService) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.token = (params as any).params.token;
      this.epersonRegistrationService.searchByToken(this.token).subscribe(res => {
        this.registrationData = res;
      });
    });

  }

  accept() {
    this.auth.getAuthenticatedUserFromStore().pipe(take(1)).subscribe((eperson: EPerson) => {
      this.epersonDataService.acceptInvitationToJoinGroups(eperson.id,
        this.registrationData.token).pipe(getFirstCompletedRemoteData()).subscribe(res => {
        this.router.navigate(['/mydspace']);
      });
    });
  }

  ignore() {
    this.router.navigate(['/home']);
  }
}
