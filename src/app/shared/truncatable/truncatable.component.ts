import {
  Component, Input
} from '@angular/core';
import { TruncatableService } from './truncatable.service';

@Component({
  selector: 'ds-truncatable',
  templateUrl: './truncatable.component.html',
  styleUrls: ['./truncatable.component.scss']
})
export class TruncatableComponent {
  @Input() minLines: number;
  @Input() maxLines: number;
  @Input() initialExpand = false;
  @Input() id: string;
  @Input() content;
  private lines: number;

  public constructor(private service: TruncatableService) {

  }

  ngOnInit() {
    if (this.initialExpand) {
      this.service.toggle(this.id);
    }
    this.setLines();
  }

  public toggleCollapse() {
    this.service.toggle(this.id);
    this.setLines();
  }

  private setLines() {
    if (this.service.isCollapsed(this.id)) {
      this.lines = this.minLines;
    } else {
      this.lines = this.maxLines;
    }
  }
}
