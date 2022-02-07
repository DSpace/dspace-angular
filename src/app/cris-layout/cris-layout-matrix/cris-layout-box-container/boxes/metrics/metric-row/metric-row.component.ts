import {
	MetricTypesConfig,
	MetricTypeConf,
} from './../../../../../../shared/metric/metric-loader/metric-loader.service';
import { MetricLoaderComponent } from './../../../../../../shared/metric/metric-loader/metric-loader.component';
import { MetricVisualizationConfig } from './../../../../../../../config/metric-visualization-config.interfaces';
import { Component, Input, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MetricRow } from '../cris-layout-metrics-box.component';
import { Metric } from '../../../../../../core/shared/metric.model';
import { environment } from 'src/environments/environment';

/**
 * This component renders the rows of metadata boxes
 */
@Component({
	// tslint:disable-next-line: component-selector
	selector: '[ds-metric-row]',
	templateUrl: './metric-row.component.html',
	styleUrls: ['./metric-row.component.scss'],
})
export class MetricRowComponent {
	/**
	 * Current row configuration
	 */
	@Input() metricRow: MetricRow;

	/**
	 * The list of metrics to be rendered
	 *
	 * @type {QueryList<MetricLoaderComponent>}
	 * @memberof MetricRowComponent
	 */
	@ViewChildren('metricComp') metricComp: QueryList<MetricLoaderComponent>;

	/**
	 * List of registered metric  types
	 *
	 * @memberof MetricRowComponent
	 */
	public metricTypes: MetricTypeConf[] = MetricTypesConfig;

	/**
	 * List of configrued metric's style in the environment
	 *
	 * @memberof MetricRowComponent
	 */
	public style: MetricVisualizationConfig[] = environment.metricVisualizationConfig;

	/**
	 * CSS classes applied to the metric container
	 * @param metric
	 */
	getMetricClasses(metric: Metric): any {
		if (metric) {
			let metricClass = 'alert-info'; // default style
			if (this.metricComp) {
				this.metricComp.toArray().forEach((e) => {
					// find if the metric type (that is going to be rendered) is part of MetricTypesConfig
					// if so , set the style (class) and icon from the configuration file to the metric
					const component = this.metricTypes.find((x) => x.component == e.componentType);
					if (component) {
						const metricType = this.style.find((x) => x.type == component.id);
						if (metricType) {
							metric.icon = metricType.icon;
							metricClass = metricType.class;
						}
					}
				});

				const classes: any = {};
				classes[metric.metricType] = true;
				const classlist = {
					...classes,
					alert: true,
					'metric-container': true,
				};
				classlist[metricClass] = true;
				return classlist;
			} else {
				return {};
			}
		}
	}
}
