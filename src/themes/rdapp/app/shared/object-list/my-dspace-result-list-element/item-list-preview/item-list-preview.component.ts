import {
  AsyncPipe,
  NgClass,
} from '@angular/common';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  APP_CONFIG,
  AppConfig,
} from '@dspace/config/app-config.interface';
import { DSONameService } from '@dspace/core/breadcrumbs/dso-name.service';
import { LinkService } from '@dspace/core/cache/builders/link.service';
import { RemoteData } from '@dspace/core/data/remote-data';
import { EPerson } from '@dspace/core/eperson/models/eperson.model';
import { followLink } from '@dspace/core/shared/follow-link-config.model';
import { getFirstCompletedRemoteData } from '@dspace/core/shared/operators';
import { WorkflowItem } from '@dspace/core/submission/models/workflowitem.model';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { fadeInOut } from '../../../../../../../app/shared/animations/fade';
import { MetadataDirective } from '../../../../../../../app/shared/metadata.directive';
import { MetadataLinkViewComponent } from '../../../../../../../app/shared/metadata-link-view/metadata-link-view.component';
import { ThemedBadgesComponent } from '../../../../../../../app/shared/object-collection/shared/badges/themed-badges.component';
import { ItemCollectionComponent } from '../../../../../../../app/shared/object-collection/shared/mydspace-item-collection/item-collection.component';
import { ItemSubmitterComponent } from '../../../../../../../app/shared/object-collection/shared/mydspace-item-submitter/item-submitter.component';
import { ItemListPreviewComponent as BaseComponent } from '../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component';
import { TruncatableComponent } from '../../../../../../../app/shared/truncatable/truncatable.component';
import { TruncatablePartComponent } from '../../../../../../../app/shared/truncatable/truncatable-part/truncatable-part.component';
import { ThemedThumbnailComponent } from '../../../../../../../app/thumbnail/themed-thumbnail.component';

/**
 * Card do item nas listas do MyDSpace (tarefas do curador e submissões do depositante).
 * A citação mostra a instituição (local.instituicao) no lugar do editor, como pede a HU012 CA02.
 */
@Component({
  selector: 'ds-themed-item-list-preview',
  styleUrls: ['../../../../../../../app/shared/object-list/my-dspace-result-list-element/item-list-preview/item-list-preview.component.scss'],
  templateUrl: './item-list-preview.component.html',
  animations: [fadeInOut],
  imports: [
    AsyncPipe,
    ItemCollectionComponent,
    ItemSubmitterComponent,
    MetadataDirective,
    MetadataLinkViewComponent,
    NgClass,
    ThemedBadgesComponent,
    ThemedThumbnailComponent,
    TranslateModule,
    TruncatableComponent,
    TruncatablePartComponent,
  ],
})
export class ItemListPreviewComponent extends BaseComponent implements OnInit {

  /**
   * Depositante, lido do próprio WorkflowItem. O `ds-item-submitter` da base segue o link `workflowitem` do objeto
   * indexado, que existe nas tarefas (pool e claimed) mas não no WorkflowItem nem no Item, e por isso mostrava N/D
   * no card do depositante (HU010 D5). Só é preenchido para resultados de WorkflowItem.
   */
  submitter$: Observable<EPerson | null>;

  constructor(
    @Inject(APP_CONFIG) protected appConfig: AppConfig,
    public dsoNameService: DSONameService,
    protected linkService: LinkService,
  ) {
    super(appConfig, dsoNameService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    const resultado = this.object?.indexableObject;
    if (this.showSubmitter && resultado instanceof WorkflowItem) {
      this.linkService.resolveLink(resultado, followLink('submitter'));
      this.submitter$ = (resultado.submitter as Observable<RemoteData<EPerson>>).pipe(
        getFirstCompletedRemoteData(),
        map((rd: RemoteData<EPerson>) => rd.hasSucceeded ? rd.payload : null),
      );
    }
  }
}
