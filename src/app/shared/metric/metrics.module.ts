import { MetricLoaderComponent } from './metric-loader/metric-loader.component';
import { MetricStyleConfigPipe } from './pipes/metric-style-config/metric-style-config.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricAltmetricComponent } from './metric-altmetric/metric-altmetric.component';
import { MetricDimensionsComponent } from './metric-dimensions/metric-dimensions.component';
import { MetricDefaultComponent } from './metric-default/metric-default.component';
import {
  MetricEmbeddedDownloadComponent
} from './metric-embedded/metric-embedded-download/metric-embedded-download.component';
import { MetricEmbeddedViewComponent } from './metric-embedded/metric-embedded-view/metric-embedded-view.component';
import { MetricGooglescholarComponent } from './metric-googlescholar/metric-googlescholar.component';
import { MetricPlumxComponent } from './metric-plumx/metric-plumx.component';
import { MissingTranslationHandler, TranslateModule } from '@ngx-translate/core';
import { MissingTranslationHelper } from '../translate/missing-translation.helper';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ListMetricPropsPipe } from './pipes/list-metric-props/list-metric-props.pipe';
import { MetricBadgesComponent } from '../object-list/metric-badges/metric-badges.component';
import { MetricDonutsComponent } from '../object-list/metric-donuts/metric-donuts.component';
import { FormsModule } from '@angular/forms';
import { DirectivesModule } from '../../directives/directives.module';

const PIPES = [
  MetricStyleConfigPipe,
  ListMetricPropsPipe
];

const MODULES = [
  CommonModule,
  DirectivesModule,
  FormsModule,
  NgbTooltipModule,
];

const COMPONENTS = [
  MetricAltmetricComponent,
  MetricDimensionsComponent,
  MetricGooglescholarComponent,
  MetricEmbeddedViewComponent,
  MetricEmbeddedDownloadComponent,
  MetricPlumxComponent,
  MetricBadgesComponent,
  MetricDonutsComponent,
  MetricLoaderComponent,
  MetricDefaultComponent
];
@NgModule({
  declarations: [
    ...PIPES,
    ...COMPONENTS,
  ],
  imports: [
    ...MODULES,
    TranslateModule.forChild({
      missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
      useDefaultLang: true
    }),
  ],
  exports: [
    ...COMPONENTS,
  ]
})
export class MetricsModule {
}
