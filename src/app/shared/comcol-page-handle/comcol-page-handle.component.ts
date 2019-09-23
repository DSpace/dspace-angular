import { Component, Input, Inject, Injectable } from '@angular/core';
import { GlobalConfig } from '../../../config/global-config.interface';
import { GLOBAL_CONFIG } from '../../../config';
import { RESTURLCombiner } from '../../core/url-combiner/rest-url-combiner';
import { URLCombiner } from '../../core/url-combiner/url-combiner';
/**
 * This component builds a URL from the value of "handle"
 */

@Component({
  selector: 'ds-comcol-page-handle',
  styleUrls: ['./comcol-page-handle.component.scss'],
  templateUrl: './comcol-page-handle.component.html'
})

@Injectable()
export class ComcolPageHandleComponent {

  // Optional title
  @Input() title: string;

  // The value of "handle"
  @Input() content: string;

  constructor(@Inject(GLOBAL_CONFIG) private EnvConfig: GlobalConfig) {
  }
  protected getRootHref(): string {
    return new RESTURLCombiner(this.EnvConfig, '/').toString();
  }
  public getHandle(content: string): string {
    return new URLCombiner(this.getRootHref(), '/handle/', this.content).toString();
  }

}
