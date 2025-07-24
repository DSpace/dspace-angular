import { AsyncPipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  BehaviorSubject,
  catchError,
  Observable,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { RemoteData } from '../../../core/data/remote-data';
import { OrcidAuthService } from '../../../core/orcid/orcid-auth.service';
import { ResearcherProfile } from '../../../core/profile/model/researcher-profile.model';
import {
  NativeWindowRef,
  NativeWindowService,
} from '../../../core/services/window.service';
import { Item } from '../../../core/shared/item.model';
import { getFirstCompletedRemoteData } from '../../../core/shared/operators';
import { AlertComponent } from '../../../shared/alert/alert.component';
import { AlertType } from '../../../shared/alert/alert-type';
import { BtnDisabledDirective } from '../../../shared/btn-disabled.directive';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { createFailedRemoteDataObjectFromError$ } from '../../../shared/remote-data.utils';

@Component({
  selector: 'ds-orcid-auth',
  templateUrl: './orcid-auth.component.html',
  styleUrls: ['./orcid-auth.component.scss'],
  imports: [
    AlertComponent,
    AsyncPipe,
    BtnDisabledDirective,
    TranslateModule,
  ],
  standalone: true,
})
export class OrcidAuthComponent implements OnInit, OnChanges {

  /**
   * The item for which showing the orcid settings
   */
  @Input() item: Item;

  /**
   * The list of exposed orcid authorization scopes for the orcid profile
   */
  profileAuthorizationScopes$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  hasOrcidAuthorizations$: Observable<boolean>;

  /**
   * The list of all orcid authorization scopes missing in the orcid profile
   */
  missingAuthorizationScopes: BehaviorSubject<string[]> = new BehaviorSubject([]);

  hasMissingOrcidAuthorizations$: Observable<boolean>;

  /**
   * The list of all orcid authorization scopes available
   */
  orcidAuthorizationScopes: BehaviorSubject<string[]> = new BehaviorSubject([]);

  /**
   * A boolean representing if unlink operation is processing
   */
  unlinkProcessing: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * A boolean representing if orcid profile is linked
   */
  isOrcidLinked$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * A boolean representing if only admin can disconnect orcid profile
   */
  onlyAdminCanDisconnectProfileFromOrcid$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * A boolean representing if owner can disconnect orcid profile
   */
  ownerCanDisconnectProfileFromOrcid$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * An event emitted when orcid profile is unliked successfully
   */
  @Output() unlink: EventEmitter<void> = new EventEmitter<void>();

  readonly AlertType = AlertType;

  constructor(
    private orcidAuthService: OrcidAuthService,
    private translateService: TranslateService,
    private notificationsService: NotificationsService,
    @Inject(NativeWindowService) private _window: NativeWindowRef,
  ) {
  }

  ngOnInit() {
    this.orcidAuthService.getOrcidAuthorizationScopes().subscribe((scopes: string[]) => {
      this.orcidAuthorizationScopes.next(scopes);
      this.initOrcidAuthSettings();
    });
    this.hasOrcidAuthorizations$ = this.hasOrcidAuthorizations();
    this.hasMissingOrcidAuthorizations$ = this.hasMissingOrcidAuthorizations();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.item.isFirstChange() && changes.item.currentValue !== changes.item.previousValue) {
      this.initOrcidAuthSettings();
    }
  }

  /**
   * Check if the list of exposed orcid authorization scopes for the orcid profile has values
   */
  hasOrcidAuthorizations(): Observable<boolean> {
    return this.profileAuthorizationScopes$.pipe(
      map((scopes: string[]) => scopes.length > 0),
    );
  }

  /**
   * Check if the list of exposed orcid authorization scopes for the orcid profile has values
   */
  hasMissingOrcidAuthorizations(): Observable<boolean> {
    return this.missingAuthorizationScopes.asObservable().pipe(
      map((scopes: string[]) => scopes.length > 0),
    );
  }

  getOrcidNotLinkedMessage(): string {
    const orcid = this.item.firstMetadataValue('person.identifier.orcid');
    if (orcid) {
      return this.translateService.instant('person.page.orcid.orcid-not-linked-message', { 'orcid': orcid });
    } else {
      return this.translateService.instant('person.page.orcid.no-orcid-message');
    }
  }

  /**
   * Get label for a given orcid authorization scope
   *
   * @param scope
   */
  getAuthorizationDescription(scope: string) {
    return 'person.page.orcid.scope.' + scope.substring(1).replace('/', '-');
  }

  /**
   * Return a boolean representing if owner can disconnect orcid profile
   */
  ownerCanDisconnectProfileFromOrcid(): Observable<boolean> {
    return this.ownerCanDisconnectProfileFromOrcid$.asObservable();
  }

  /**
   * Link existing person profile with orcid
   */
  linkOrcid(): void {
    this.orcidAuthService.getOrcidAuthorizeUrl(this.item).subscribe((authorizeUrl) => {
      this._window.nativeWindow.location.href = authorizeUrl;
    });
  }

  /**
   * Unlink existing person profile from orcid
   */
  unlinkOrcid(): void {
    this.unlinkProcessing.next(true);
    this.orcidAuthService.unlinkOrcidByItem(this.item).pipe(
      getFirstCompletedRemoteData(),
      catchError(createFailedRemoteDataObjectFromError$<ResearcherProfile>),
    ).subscribe((remoteData: RemoteData<ResearcherProfile>) => {
      this.unlinkProcessing.next(false);
      if (remoteData.hasFailed) {
        this.notificationsService.error(this.translateService.get('person.page.orcid.unlink.error'));
      } else {
        this.notificationsService.success(this.translateService.get('person.page.orcid.unlink.success'));
        this.unlink.emit();
      }
    });
  }

  /**
   * initialize all Orcid authentication settings
   * @private
   */
  private initOrcidAuthSettings(): void {

    this.setOrcidAuthorizationsFromItem();

    this.setMissingOrcidAuthorizations();

    this.orcidAuthService.onlyAdminCanDisconnectProfileFromOrcid().subscribe((result) => {
      this.onlyAdminCanDisconnectProfileFromOrcid$.next(result);
    });

    this.orcidAuthService.ownerCanDisconnectProfileFromOrcid().subscribe((result) => {
      this.ownerCanDisconnectProfileFromOrcid$.next(result);
    });

    this.isOrcidLinked$.next(this.orcidAuthService.isLinkedToOrcid(this.item));
  }

  private setMissingOrcidAuthorizations(): void {
    const profileScopes = this.orcidAuthService.getOrcidAuthorizationScopesByItem(this.item);
    const orcidScopes = this.orcidAuthorizationScopes.value;
    const missingScopes = orcidScopes.filter((scope) => !profileScopes.includes(scope));

    this.missingAuthorizationScopes.next(missingScopes);
  }

  private setOrcidAuthorizationsFromItem(): void {
    this.profileAuthorizationScopes$.next(this.orcidAuthService.getOrcidAuthorizationScopesByItem(this.item));
  }

}
