import {
  Component,
  Input,
} from '@angular/core';

import { UpdateDataService } from '../../core/data/update-data.service';
import { DSpaceObject } from '../../core/shared/dspace-object.model';
import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { DsoEditMetadataComponent } from './dso-edit-metadata.component';

@Component({
  selector: 'ds-dso-edit-metadata',
  styleUrls: [],
  templateUrl: './../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [DsoEditMetadataComponent],
})
export class ThemedDsoEditMetadataComponent extends ThemedComponent<DsoEditMetadataComponent> {

  @Input() dso: DSpaceObject;

  @Input() updateDataService: UpdateDataService<DSpaceObject>;

  protected inAndOutputNames: (keyof DsoEditMetadataComponent & keyof this)[] = ['dso', 'updateDataService'];

  protected getComponentName(): string {
    return 'DsoEditMetadataComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/dso-shared/dso-edit-metadata/dso-edit-metadata.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./dso-edit-metadata.component`);
  }


}
