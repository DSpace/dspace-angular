import { Component, OnInit } from '@angular/core';
import { DspaceRestService } from '../../core/dspace-rest/dspace-rest.service';
import { HALEndpointService } from '../../core/shared/hal-endpoint.service';

@Component({
  selector: 'ds-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.scss']
})
export class HealthComponent implements OnInit {

  constructor(protected halService: HALEndpointService,
    protected restService: DspaceRestService) {
    }

  ngOnInit(): void {
    this.halService.getRootHref();
    console.log('this.halService.getRootHref()',);
    this.restService.get(this.halService.getRootHref() + '/actuator' + '/health').subscribe((data)=>{
      console.log(data);
      
    })
    
  }

}
