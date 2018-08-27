import {
  Component, Input
} from '@angular/core';
import { TruncatableService } from './truncatable.service';

@Component({
  selector: 'ds-truncatable',
  templateUrl: './truncatable.component.html',
  styleUrls: ['./truncatable.component.scss'],

})

/**
 * Component that represents a section with one or more truncatable parts that all listen to this state
 */
export class TruncatableComponent {
  /**
   * Is true when all truncatable parts in this truncatable should be expanded on loading
   */
  @Input() initialExpand = false;

  /**
   * The unique identifier of this truncatable component
   */
  @Input() id: string;

  /**
   * Is true when the truncatable should expand on both hover as click
   */
  @Input() onHover = false;

  public constructor(private service: TruncatableService) {
  }

  /**
   * Set the initial state
   */
  ngOnInit() {
    if (this.initialExpand) {
      this.service.expand(this.id);
    } else {
      this.service.collapse(this.id);
    }
  }

  /**
   * If onHover is true, collapses the truncatable
   */
  public hoverCollapse() {
    if (this.onHover) {
      this.service.collapse(this.id);
    }
  }

  /**
   * If onHover is true, expands the truncatable
   */
  public hoverExpand() {
    if (this.onHover) {
      this.service.expand(this.id);
    }
  }

  /**
   * Expands the truncatable when it's collapsed, collapses it when it's expanded
   */
  public toggle() {
    this.service.toggle(this.id);
  }

}
