import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ItemDataService } from '../../core/data/item-data.service';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';
import { fadeInOut } from '../../shared/animations/fade';
import {
  getAllSucceededRemoteDataPayload,
  getAllSucceededRemoteListPayload,
} from '../../core/shared/operators';
import { ViewMode } from '../../core/shared/view-mode.model';
import { AuthService } from '../../core/auth/auth.service';
import { getItemPageRoute } from '../item-page-routing-paths';
import { redirectOn4xx } from '../../core/shared/authorized.operators';
import { AuthorizationDataService } from '../../core/data/feature-authorization/authorization-data.service';
import { FeatureID } from '../../core/data/feature-authorization/feature-id';
import { ServerResponseService } from '../../core/services/server-response.service';
import { SignpostingDataService } from '../../core/data/signposting-data.service';
import { SignpostingLink } from '../../core/data/signposting-links.model';
import { isNotEmpty } from '../../shared/empty.util';
import { LinkDefinition, LinkHeadService } from '../../core/services/link-head.service';
import { BehaviorSubject } from 'rxjs';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';
import {RegistryService} from '../../core/registry/registry.service';
import {MetadataBitstream} from '../../core/metadata/metadata-bitstream.model';

/**
 * This component renders a simple item page.
 * The route parameter 'id' is used to request the item it represents.
 * All fields of the item that should be displayed, are defined in its template.
 */
@Component({
  selector: 'ds-item-page',
  styleUrls: ['./item-page.component.scss'],
  templateUrl: './item-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeInOut]
})
export class ItemPageComponent implements OnInit, OnDestroy {

  /**
   * The item's id
   */
  id: number;

  /**
   * The item wrapped in a remote-data object
   */
  itemRD$: Observable<RemoteData<Item>>;

  /**
   * The view-mode we're currently on
   */
  viewMode = ViewMode.StandalonePage;

  /**
   * Route to the item's page
   */
  itemPageRoute$: Observable<string>;
  /**
   * handle of the specific item
   */
  itemHandle: string;
  /**
   * handle of the specific item
   */
  fileName: string;
  /**
   * determine to show download all zip button or not
   */
  canDownloadAllFiles = false;
  /**
   * command for the download command feature
   */
  command: string;

  /**
   * Whether the current user is an admin or not
   */
  isAdmin$: Observable<boolean>;

  /**
   * If item is withdrawn and has new destination in the metadata: `dc.relation.isreplacedby`
   */
  replacedTombstone = false;

  /**
   * If item is withdrawn and has/doesn't has reason of withdrawal
   */
  withdrawnTombstone = false;

  /**
   * If download by command button is click, the command line will be shown
   */
  isCommandLineVisible = false;
  /**
   * list of files uploaded by users to this item
   */
  listOfFiles: MetadataBitstream[];
  /**
   * total size of list of files uploaded by users to this item
   */
  totalFileSizes: string;

  itemUrl: string;

  canShowCurlDownload = false;

  /**
   * True if the item has files, false otherwise.
   */
  hasFiles: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /**
   * Contains a list of SignpostingLink related to the item
   */
  signpostingLinks: SignpostingLink[] = [];

  constructor(
    protected route: ActivatedRoute,
    protected router: Router,
    protected items: ItemDataService,
    protected authService: AuthService,
    protected authorizationService: AuthorizationDataService,
    protected responseService: ServerResponseService,
    protected signpostingDataService: SignpostingDataService,
    protected linkHeadService: LinkHeadService,
    @Inject(PLATFORM_ID) protected platformId: string,
    protected registryService: RegistryService,
    protected halService: HALEndpointService
) {
    this.initPageLinks();
  }

  /**
   * Initialize instance variables
   */
  ngOnInit(): void {
    this.itemRD$ = this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>),
      redirectOn4xx(this.router, this.authService)
    );
    this.itemPageRoute$ = this.itemRD$.pipe(
      getAllSucceededRemoteDataPayload(),
      map((item) => getItemPageRoute(item))
    );

    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);

    this.processItem();

    this.registryService
      .getMetadataBitstream(this.itemHandle, 'ORIGINAL,TEXT,THUMBNAIL')
      .pipe(getAllSucceededRemoteListPayload())
      .subscribe((data: MetadataBitstream[]) => {
        this.listOfFiles = data;
        this.generateCurlCommand();
        this.sumFileSizes();
      });
  }

  /**
   * Create page links if any are retrieved by signposting endpoint
   *
   * @private
   */
  private initPageLinks(): void {
    this.route.params.subscribe(params => {
      this.signpostingDataService.getLinks(params.id).pipe(take(1)).subscribe((signpostingLinks: SignpostingLink[]) => {
        let links = '';
        this.signpostingLinks = signpostingLinks;

        signpostingLinks.forEach((link: SignpostingLink) => {
          links = links + (isNotEmpty(links) ? ', ' : '') + `<${link.href}> ; rel="${link.rel}"` + (isNotEmpty(link.type) ? ` ; type="${link.type}" ` : ' ');
          let tag: LinkDefinition = {
            href: link.href,
            rel: link.rel
          };
          if (isNotEmpty(link.type)) {
            tag = Object.assign(tag, {
              type: link.type
            });
          }
          this.linkHeadService.addTag(tag);
        });

        if (isPlatformServer(this.platformId)) {
          this.responseService.setHeader('Link', links);
        }
      });
    });
  }

  /**
   * Check if the item has files and assign the result into the `hasFiles` variable.
   * */
  private checkIfItemHasFiles(item: Item) {
    const hasFilesMetadata = item.metadata?.['local.has.files']?.[0]?.value;
    this.hasFiles.next(hasFilesMetadata !== 'no');
  }

  sumFileSizes() {
    const sizeUnits = {
      B: 1,
      KB: 1000,
      MB: 1000 * 1000,
      GB: 1000 * 1000 * 1000,
      TB: 1000 * 1000 * 1000 * 1000,
    };

    let totalBytes = this.listOfFiles.reduce((total, file) => {
      const [valueStr, unit] = file.fileSize.split(' ');
      const value = parseFloat(valueStr);
      const bytes = value * sizeUnits[unit.toUpperCase()];
      return total + bytes;
    }, 0);

    let finalUnit = 'B';
    for (const unit of ['KB', 'MB', 'GB', 'TB']) {
      if (totalBytes < 1000) {
        break;
      }
      totalBytes /= 1000;
      finalUnit = unit;
    }

    this.totalFileSizes = totalBytes.toFixed(2) + ' ' + finalUnit;
  }

  /**
   * Process the tombstone of the Item and check if it has files or not.
   */
  processItem() {
    // if the item is withdrawn
    let isWithdrawn = false;
    // metadata value from `dc.relation.isreplacedby`
    let isReplaced = '';

    // load values from item
    this.itemRD$.pipe(
      take(1),
      getAllSucceededRemoteDataPayload())
      .subscribe((item: Item) => {
        this.itemHandle = item.handle;
        isWithdrawn = item.isWithdrawn;
        isReplaced = item.metadata['dc.relation.isreplacedby']?.[0]?.value;

        // check if the item has files
        this.checkIfItemHasFiles(item);
      });

    // do not show tombstone for non withdrawn items
    if (!isWithdrawn) {
      return;
    }

    // for users navigate to the custom tombstone
    // for admin stay on the item page with tombstone flag
    this.isAdmin$ = this.authorizationService.isAuthorized(FeatureID.AdministratorOf);
    this.isAdmin$.subscribe(isAdmin => {
      // do not show tombstone for admin but show it for users
      if (!isAdmin) {
        if (isNotEmpty(isReplaced)) {
          this.replacedTombstone = true;
        } else {
          this.withdrawnTombstone = true;
        }
      }
    });
  }

  setCommandline() {
    this.isCommandLineVisible = !this.isCommandLineVisible;
  }

  generateCurlCommand() {
    const fileNames = this.listOfFiles.map((file: MetadataBitstream) => {
      // Show `Download All Files` only if there are more files.
      if (this.listOfFiles.length > 1) {
        this.canDownloadAllFiles = true;
      }

      if (file.canPreview) {
        this.canShowCurlDownload = true;
      }

      return file.name;
    });

    this.command = `curl --remote-name-all ` + this.halService.getRootHref() + `/core/bitstreams/handle/${
      this.itemHandle
    }/{${fileNames.join(',')}}`;
  }

  downloadFiles() {
    this.itemRD$.pipe(
      take(1),
      getAllSucceededRemoteDataPayload())
      .subscribe((item: Item) => void this.router.navigate([getItemPageRoute(item), 'download']));
  }

  ngOnDestroy(): void {
    this.signpostingLinks.forEach((link: SignpostingLink) => {
      this.linkHeadService.removeTag(`href='${link.href}'`);
    });
  }
}
