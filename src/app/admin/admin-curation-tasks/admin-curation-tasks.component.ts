import { Component } from '@angular/core';
import { CurationFormComponent } from "../../curation-form/curation-form.component";
import { TranslateModule } from "@ngx-translate/core";

/**
 * Component responsible for rendering the system wide Curation Task UI
 */
@Component({
  selector: 'ds-admin-curation-task',
  templateUrl: './admin-curation-tasks.component.html',
  imports: [
    CurationFormComponent,
    TranslateModule
  ],
  standalone: true
})
export class AdminCurationTasksComponent {

}
