import { Component, Input, OnInit } from '@angular/core';
import { Bitstream } from '../../../core/shared/bitstream.model';
import { hasValue } from '../../empty.util';

/**
 * This component renders a given Bitstream as a thumbnail.
 * One input parameter of type Bitstream is expected.
 * If no Bitstream is provided, a holderjs image will be rendered instead.
 */

@Component({
  selector: 'ds-grid-thumbnail',
  styleUrls: ['./grid-thumbnail.component.scss'],
  templateUrl: './grid-thumbnail.component.html'
})
export class GridThumbnailComponent implements OnInit {

  @Input() thumbnail: Bitstream;

  data: any = {};

  /**
   * The default 'holder.js' image
   */
  @Input() defaultImage? = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMjYwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDI2MCAxODAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjwhLS0KU291cmNlIFVSTDogaG9sZGVyLmpzLzEwMCV4MTgwL3RleHQ6Tm8gVGh1bWJuYWlsCkNyZWF0ZWQgd2l0aCBIb2xkZXIuanMgMi42LjAuCkxlYXJuIG1vcmUgYXQgaHR0cDovL2hvbGRlcmpzLmNvbQooYykgMjAxMi0yMDE1IEl2YW4gTWFsb3BpbnNreSAtIGh0dHA6Ly9pbXNreS5jbwotLT48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWyNob2xkZXJfMTVmNzJmMmFlMGIgdGV4dCB7IGZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxM3B0IH0gXV0+PC9zdHlsZT48L2RlZnM+PGcgaWQ9ImhvbGRlcl8xNWY3MmYyYWUwYiI+PHJlY3Qgd2lkdGg9IjI2MCIgaGVpZ2h0PSIxODAiIGZpbGw9IiNFRUVFRUUiLz48Zz48dGV4dCB4PSI3Mi4yNDIxODc1IiB5PSI5NiI+Tm8gVGh1bWJuYWlsPC90ZXh0PjwvZz48L2c+PC9zdmc+';

  src: string;
  errorHandler(event) {
    event.currentTarget.src = this.defaultImage;
  }

  ngOnInit(): void {
    if (hasValue(this.thumbnail) && this.thumbnail.content) {
      this.src = this.thumbnail.content;
    } else {
      this.src = this.defaultImage
    }
  }

}
