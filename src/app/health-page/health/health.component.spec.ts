import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TranslateLoaderMock } from '../../shared/mocks/translate-loader.mock';
import { HealthDataService } from '../health-data.service';
import { HealthPageRoutingModule } from '../health.routing.module';
import { HealthComponent } from './health.component';

 function getHealth() {
   return of({
    'payload':{
       'status':'UP_WITH_ISSUES',
       'components':{
          'db':{
             'status':'UP',
             'components':{
                'dataSource':{
                   'status':'UP',
                   'details':{
                      'database':'PostgreSQL',
                      'result':1,
                      'validationQuery':'SELECT 1'
                   }
                },
                'dspaceDataSource':{
                   'status':'UP',
                   'details':{
                      'database':'PostgreSQL',
                      'result':1,
                      'validationQuery':'SELECT 1'
                   }
                }
             }
          },
          'geoIp':{
             'status':'UP_WITH_ISSUES',
             'details':{
                'reason':'The GeoLite Database file is missing (/var/lib/GeoIP/GeoLite2-City.mmdb)! Solr Statistics cannot generate location based reports! Please see the DSpace installation instructions for instructions to install this file.'
             }
          },
          'solrOaiCore':{
             'status':'UP',
             'details':{
                'status':0,
                'detectedPathType':'particular core'
             }
          },
          'solrSearchCore':{
             'status':'UP',
             'details':{
                'status':0,
                'detectedPathType':'particular core'
             }
          },
          'solrStatisticsCore':{
             'status':'UP',
             'details':{
                'status':0,
                'detectedPathType':'particular core'
             }
          }
       }
    },
    'statusCode':200,
    'statusText':'OK'
   });
 }

 function getInfo() {
  return of({
    'payload':{
       'app':{
          'name':'DSpace at My University',
          'version':'7.3',
          'dir':'/Users/pratikrajkotiya/Documents/Project/FrontEnd/dspace-cris-install',
          'url':'http://localhost:8080/server',
          'db':'jdbc:postgresql://localhost:5432/4science',
          'solr':{
             'server':'http://localhost:8983/solr',
             'prefix':''
          },
          'mail':{
             'server':'smtp.example.com',
             'from-address':'dspace-noreply@myu.edu',
             'feedback-recipient':'dspace-help@myu.edu',
             'mail-admin':'dspace-help@myu.edu',
             'mail-helpdesk':'dspace-help@myu.edu',
             'alert-recipient':'dspace-help@myu.edu'
          },
          'cors':{
             'allowed-origins':'http://localhost:4000'
          },
          'ui':{
             'url':'http://localhost:4000'
          }
       }
    },
    'statusCode':200,
    'statusText':'OK'
   });
 }

function getMockHealthDataService() {
  return jasmine.createSpyObj('healthDataService', {
    getHealth: getHealth(),
    getInfo: getInfo()
  });
}

fdescribe('HealthComponent', () => {
  let component: HealthComponent;
  let fixture: ComponentFixture<HealthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgbNavModule,
        CommonModule,
        HealthPageRoutingModule,
        MatExpansionModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateLoaderMock
          }
        }),
      ],
      declarations: [ HealthComponent ],
      providers:[{ provide: HealthDataService, useValue: getMockHealthDataService() }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render health tab.', () => {
    const healthTab = fixture.debugElement.query(By.css('#health'));
    expect(healthTab).toBeTruthy();
  });

  it('should render info tab.', () => {
    const infoTab = fixture.debugElement.query(By.css('#info'));
    expect(infoTab).toBeFalsy();
  });

});
