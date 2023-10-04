import { Component, Input } from '@angular/core';
import { FileInfo } from 'src/app/core/metadata/metadata-bitstream.model';

@Component({
  selector: 'ds-file-tree-view',
  templateUrl: './file-tree-view.component.html',
  styleUrls: ['./file-tree-view.component.scss'],
})
export class FileTreeViewComponent {
  @Input()
  node: FileInfo;

  isCollapsed = false;

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
