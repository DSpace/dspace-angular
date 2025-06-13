import {
  AsyncPipe,
  Location,
  NgClass,
} from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  TranslatePipe,
  TranslateService,
} from '@ngx-translate/core';
import { FileUploadModule } from 'ng2-file-upload';
import { UiSwitchModule } from 'ngx-ui-switch';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { getBitstreamModuleRoute } from '../../app-routing-paths';
import { AuthService } from '../../core/auth/auth.service';
import { RemoteData } from '../../core/data/remote-data';
import { RequestService } from '../../core/data/request.service';
import { Bitstream } from '../../core/shared/bitstream.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
import {
  hasValue,
  isEmpty,
} from '../../shared/empty.util';
import { ErrorComponent } from '../../shared/error/error.component';
import { ThemedLoadingComponent } from '../../shared/loading/themed-loading.component';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { UploaderComponent } from '../../shared/upload/uploader/uploader.component';
import { UploaderOptions } from '../../shared/upload/uploader/uploader-options.model';
import { FileSizePipe } from '../../shared/utils/file-size-pipe';
import { VarDirective } from '../../shared/utils/var.directive';

@Component({
  selector: 'ds-replace-bitstream-page',
  templateUrl: './replace-bitstream-page.component.html',
  styleUrls: ['./replace-bitstream-page.component.scss'],
  imports: [
    AsyncPipe,
    ErrorComponent,
    FileSizePipe,
    FileUploadModule,
    NgClass,
    ThemedLoadingComponent,
    TranslatePipe,
    UiSwitchModule,
    UploaderComponent,
    VarDirective,
  ],
  standalone: true,
})
export class ReplaceBitstreamPageComponent implements OnInit {
  saveNotificationKey = 'bitstream.replace.page.upload.success';
  /**
   * The uploader configuration options
   * @type {UploaderOptions}
   */
  uploadFilesOptions: UploaderOptions = Object.assign(new UploaderOptions(), {
    // URL needs to contain something to not produce any errors. This will be replaced once a bundle has been selected.
    url: 'placeholder', /* TODO Change upload URL */
    authToken: null,
    disableMultipart: false,
    itemAlias: null,
    autoUpload: false,
  });

  /**
   * Upload url without parameters
   */
  private uploadFilesUrlNoParam: string;

  /**
   * The bitstream's remote data observable
   * Tracks changes and updates the view
   */
  bitstreamRD$: Observable<RemoteData<Bitstream>>;

  /**
   * Whether to keep the file name of the new uploaded file
   */
  protected shouldReplaceName = true;

  constructor(private route: ActivatedRoute,
              private notificationService: NotificationsService,
              private location: Location,
              private translateService: TranslateService,
              private authService: AuthService,
              private requestService: RequestService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.bitstreamRD$ = this.route.data.pipe(map((data) => data.bitstream));
    this.setUploadUrl();
  }

  back() {
    this.location.back();
  }

  save(uploader: UploaderComponent) {
    this.setUploadUrlParameters(uploader);
    uploader.uploader.uploadAll();
  }

  /**
   * The request was successful, redirect the user
   * @param bitstream
   */
  public onCompleteItem(bitstream: Bitstream) {
    this.requestService.setStaleByHrefSubstring(bitstream.self);
    this.requestService.setStaleByHrefSubstring(bitstream._links.bundle.href);
    this.notificationService.success(this.translateService.instant(this.saveNotificationKey));
    this.router.navigate([getBitstreamModuleRoute(), bitstream.id, 'edit']);
  }

  /**
   * The request was unsuccessful, display an error notification
   */
  public onUploadError() {
    this.notificationService.error(null, this.translateService.get('bitstream.replace.page.upload.failed'));
  }

  /**
   * Set the replace url to match the selected bitstream ID
   */
  setUploadUrl() {
    this.bitstreamRD$.pipe(
      getFirstSucceededRemoteDataPayload(),
      map((bitstream) => bitstream._links.self.href),
    ).subscribe((href: string) => {
      this.uploadFilesUrlNoParam = href;
      this.setUploadUrlParameters();
      if (isEmpty(this.uploadFilesOptions.authToken)) {
        this.uploadFilesOptions.authToken = this.authService.buildAuthHeader();
      }
    });
  }

  protected setUploadUrlParameters(uploader?: UploaderComponent) {
    this.uploadFilesOptions.url = new URLCombiner(this.uploadFilesUrlNoParam, `/replace?replaceName=${this.shouldReplaceName}`).toString();
    if (hasValue(uploader?.uploader?.options)) {
      uploader.uploader.options.url = this.uploadFilesOptions.url;
    }
  }

}
