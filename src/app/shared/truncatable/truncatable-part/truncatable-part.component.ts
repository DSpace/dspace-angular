import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TruncatableService } from '../truncatable.service';
import { hasValue } from '../../empty.util';

@Component({
  selector: 'ds-truncatable-part',
  templateUrl: './truncatable-part.component.html',
  styleUrls: ['./truncatable-part.component.scss']
})

/**
 * Component that truncates/clamps a piece of text
 * It needs a TruncatableComponent parent to identify it's current state
 */
export class TruncatablePartComponent implements OnInit, OnDestroy {
  /**
   * Number of lines shown when the part is collapsed
   */
  @Input() minLines: number;

  /**
   * Number of lines shown when the part is expanded. -1 indicates no limit
   */
  @Input() maxLines = -1;

  /**
   * The identifier of the parent TruncatableComponent
   */
  @Input() id: string;

  /**
   * Type of text, can be a h4 for headers or any other class you want to add
   */
  @Input() type: string;

  /**
   * True if the minimal height of the part should at least be as high as it's minimum amount of lines
   */
  @Input() fixedHeight = false;

  @Input() background = 'default';

  /**
   * Current amount of lines shown of this part
   */
  lines: string;

  /**
   * Subscription to unsubscribe from
   */
  private sub;

  public constructor(private service: TruncatableService) {
  }

  /**
   * Initialize lines variable
   */
  ngOnInit() {
    this.setLines();
  }

  /**
   * Subscribe to the current state to determine how much lines should be shown of this part
   */
  private setLines() {
    this.sub = this.service.isCollapsed(this.id).subscribe((collapsed: boolean) => {
      if (collapsed) {
        this.lines = this.minLines.toString();
      } else {
        this.lines = this.maxLines < 0 ? 'none' : this.maxLines.toString();
      }
    });
  }

  /**
   * Unsubscribe from the subscription
   */
  ngOnDestroy(): void {
    if (hasValue(this.sub)) {
      this.sub.unsubscribe();
    }
  }
}
