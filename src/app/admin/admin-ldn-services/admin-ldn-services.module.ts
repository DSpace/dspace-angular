import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LdnItemfiltersService } from './ldn-services-data/ldn-itemfilters-data.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [LdnItemfiltersService],
})
export class AdminLdnServicesModule {
}
