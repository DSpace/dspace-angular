import { Component, OnInit } from '@angular/core';
import { WorkspaceitemDataService } from '../core/submission/workspaceitem-data.service';
import { MessageService } from '../core/message/message.service';
import { PlatformService } from '../shared/services/platform.service';
import { HttpOptions } from '../core/dspace-rest-v2/dspace-rest-v2.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'ds-home-page',
  styleUrls: [ './home-page.component.scss' ],
  templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit {

  constructor(private messageService: MessageService, private platform: PlatformService) {}

  ngOnInit() {
    const params = {
      uuid: 'a1951b8b-fe4c-4141-9409-8833ed579dcc',
      subject: 'subject test',
      description: 'description test'
    };
    const paramsRead = {
      uuid: '0058802a-1351-4788-acc7-5f717540dd2a',
    };
    const body = encodeURI(`uuid=${params.uuid}&subject=${params.subject}&description=${params.description}`);
    const options: HttpOptions = Object.create({});
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    options.headers = headers;
    if (this.platform.isBrowser) {
      /*this.messageService.createMessage(body, options)
        .subscribe((r) => {
          console.log(r);
        });*/
      this.messageService.markAsRead(paramsRead)
        .subscribe((r) => {
          console.log(r);
        });
    }
  }
}
