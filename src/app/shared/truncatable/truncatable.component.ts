import {
  Component, Input
} from '@angular/core';
import { TruncatableService } from './truncatable.service';
import { Observable } from 'rxjs/Observable';
import { cardExpand } from '../animations/card-expand';

@Component({
  selector: 'ds-truncatable',
  templateUrl: './truncatable.component.html',
  styleUrls: ['./truncatable.component.scss'],

})
export class TruncatableComponent {
  @Input() initialExpand = false;
  @Input() id: string;
  @Input() onHover = false;

  public constructor(private service: TruncatableService) {
  }

  ngOnInit() {
    if (this.initialExpand) {
      this.service.expand(this.id);
    } else {
      this.service.collapse(this.id);
    }
  }

  public hoverCollapse() {
    if (this.onHover) {
      this.service.collapse(this.id);
    }
  }

  public hoverExpand() {
    if (this.onHover) {
      this.service.expand(this.id);
    }
  }

  public toggle() {
    this.service.toggle(this.id);
  }

}
