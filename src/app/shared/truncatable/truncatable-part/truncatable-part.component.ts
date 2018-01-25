import {
  Component, Input, OnDestroy, OnInit, ElementRef, ViewChild
} from '@angular/core';
import { TruncatableService } from '../truncatable.service';

@Component({
  selector: 'ds-truncatable-part',
  templateUrl: './truncatable-part.component.html',
  styleUrls: ['./truncatable-part.component.scss']
})

export class TruncatablePartComponent implements OnInit, OnDestroy {
  @Input() minLines: number;
  @Input() maxLines = -1;
  @Input() initialExpand = false;
  @Input() id: string;
  @Input() type: string;
  private lines: string;
  private sub;

  public constructor(private service: TruncatableService) {
  }

  ngOnInit() {
    this.setLines();
  }

  private setLines() {
    this.sub = this.service.isCollapsed(this.id).subscribe((collapsed: boolean) => {
      if (collapsed) {
        this.lines = this.minLines.toString();
      } else {
        this.lines = this.maxLines < 0 ? 'none' : this.maxLines.toString();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
