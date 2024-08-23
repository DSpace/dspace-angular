import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import {
  MissingTranslationHandler,
  TranslateModule,
} from '@ngx-translate/core';

import { DirectivesModule } from '../../directives/directives.module';
import { MetricBadgesComponent } from '../object-list/metric-badges/metric-badges.component';
import { MetricDonutsComponent } from '../object-list/metric-donuts/metric-donuts.component';
import { MissingTranslationHelper } from '../translate/missing-translation.helper';
import { MetricAltmetricComponent } from './metric-altmetric/metric-altmetric.component';
import { MetricDefaultComponent } from './metric-default/metric-default.component';
import { MetricDimensionsComponent } from './metric-dimensions/metric-dimensions.component';
import { MetricEmbeddedDownloadComponent } from './metric-embedded/metric-embedded-download/metric-embedded-download.component';
import { MetricEmbeddedViewComponent } from './metric-embedded/metric-embedded-view/metric-embedded-view.component';
import { MetricGooglescholarComponent } from './metric-googlescholar/metric-googlescholar.component';
import { MetricLoaderComponent } from './metric-loader/metric-loader.component';
import { MetricPlumxComponent } from './metric-plumx/metric-plumx.component';
import { ListMetricPropsPipe } from './pipes/list-metric-props/list-metric-props.pipe';
import { MetricStyleConfigPipe } from './pipes/metric-style-config/metric-style-config.pipe';

const PIPES = [
  MetricStyleConfigPipe,
  ListMetricPropsPipe,
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
  MetricDefaultComponent,
];
@NgModule({
    imports: [
        ...MODULES,
        TranslateModule.forChild({
            missingTranslationHandler: { provide: MissingTranslationHandler, useClass: MissingTranslationHelper },
            useDefaultLang: true,
        }),
        ...PIPES,
        ...COMPONENTS,
    ],
    exports: [
        ...COMPONENTS,
    ],
})
export class MetricsModule {
}
