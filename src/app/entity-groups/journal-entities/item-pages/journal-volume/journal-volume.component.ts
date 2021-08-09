import { Component } from '@angular/core';
import { ItemComponent } from '../../../../item-page/simple/item-types/shared/item.component';
import { ViewMode } from '../../../../core/shared/view-mode.model';
import { listableObjectComponent } from '../../../../shared/object-collection/shared/listable-object/listable-object.decorator';

@listableObjectComponent('JournalVolume', ViewMode.StandalonePage)
@Component({
  selector: 'ds-journal-volume',
  styleUrls: ['./journal-volume.component.scss'],
  templateUrl: './journal-volume.component.html'
})
/**
 * The component for displaying metadata and relations of an item of the type Journal Volume
 */
export class JournalVolumeComponent extends ItemComponent {
}
