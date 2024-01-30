import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { ConfigurationDataService } from '../../core/data/configuration-data.service';
import { isNull, isUndefined } from '../../shared/empty.util';
import { BehaviorSubject } from 'rxjs';
import { getFirstSucceededRemoteData } from '../../core/shared/operators';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { RemoteData } from '../../core/data/remote-data';
import { Item } from '../../core/shared/item.model';

@Component({
  selector: 'ds-clarin-matomo-statistics',
  templateUrl: './clarin-matomo-statistics.component.html',
  styleUrls: ['./clarin-matomo-statistics.component.scss']
})
export class ClarinMatomoStatisticsComponent implements OnInit {

  constructor(protected http: HttpClient,
              private configurationService: ConfigurationDataService,
              protected route: ActivatedRoute) {
  }

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  itemRD$: BehaviorSubject<Item> = new BehaviorSubject<Item>(null);

  // Month shortcut with full name
  public months = [
    ['Jan', 'January'],
    ['Feb', 'February'],
    ['Mar', 'March'],
    ['Apr', 'April'],
    ['May', 'May'],
    ['Jun', 'June'],
    ['Jul', 'July'],
    ['Aug', 'August'],
    ['Sep', 'September'],
    ['Oct', 'October'],
    ['Nov', 'November'],
    ['Dec', 'December']
  ];

  public periodMonth = 'month';
  public periodYear = 'year';
  public periodDay = 'day';

  public actualPeriod = '';
  private periodSequence = ['year', 'month', 'day'];

  public actualYear = '';
  public actualMonth = '';

  public chartMessage = '';
  public chartLabels: ChartConfiguration<'line'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: [],
        label: 'Views',
        backgroundColor: '#9ee37d',
        borderColor: '#358600',
        pointBackgroundColor: '#1f6200',
        hidden: false,
      },
      {
        data: [],
        label: 'Downloads',
        backgroundColor: '#51b9f2',
        borderColor: '#336ab5',
        pointBackgroundColor: '#124a94',
        hidden: false,
      }
    ],


  };
  // public chartLabels: Label[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // `lineTension: 0` = straight lines
  // public chartData: ChartDataSets[] = [
  //   {
  //     data: [],
  //     label: 'Views',
  //     backgroundColor: '#9ee37d',
  //     borderColor: '#358600',
  //     pointBackgroundColor: '#1f6200',
  //     hidden: false,
  //     lineTension: 0
  //   },
  //   {
  //     data: [],
  //     label: 'Downloads',
  //     backgroundColor: '#51b9f2',
  //     borderColor: '#336ab5',
  //     pointBackgroundColor: '#124a94',
  //     hidden: false,
  //     lineTension: 0
  //   }
  // ];

  public color = '#27496d';
  public chartOptions: ChartConfiguration['options'] = {
    scales: {
      x: {
        grid: {
          color: this.color
        },
        ticks: {
          color: '#00a8cc'
        },
      },
      y:{
        grid: {
          color: this.color
        },
        ticks: {
          color: this.color
        }
      }
    }
  };

  public viewsButtonClicked = true;
  public downloadsButtonClicked = true;

  public filesDownloads: BehaviorSubject<{ [name: string]: number }> = new BehaviorSubject({});


  ngOnInit(): void {
    this.route.data.pipe(
      map((data) => data.dso as RemoteData<Item>))
      .subscribe(data => {
        this.itemRD$.next(data?.payload);
      });

    this.actualPeriod = this.periodYear;
    this.fetchDataAndUpdateChart(undefined);
  }

  private getActualPeriodIndex() {
    let actualPeriodIndex = 0;
    this.periodSequence.forEach((per, index) => {
      if (per === this.actualPeriod) {
        actualPeriodIndex = index;
      }
    });
    return actualPeriodIndex;
  }

  back() {
    this.setToPreviousPeriod();
    this.fetchDataAndUpdateChart(undefined);
  }
  // 0 = year, 1 = month, 2 = day
  private setToPreviousPeriod() {
    let actualPeriodIndex = this.getActualPeriodIndex();
    if (actualPeriodIndex === 0) {
      // The actual period is year period - there is no way back
      return;
    }

    this.actualPeriod = this.periodSequence[--actualPeriodIndex];
  }

  // 0 = year, 1 = month, 2 = day
  private setToNextPeriod() {
    let actualPeriodIndex = this.getActualPeriodIndex();
    if (actualPeriodIndex === 2 ) {
      // The actual period is year period - there is no way back
      return;
    }

    this.actualPeriod = this.periodSequence[++actualPeriodIndex];
  }

  // Hide/Show the dataset
  toggleDownload() {
    const index = 1;
    this.toggleDatasetHidden(index);
    this.downloadsButtonClicked = !this.downloadsButtonClicked;
  }

  toggleViews() {
    const index = 0;
    this.toggleDatasetHidden(index);
    this.viewsButtonClicked = !this.viewsButtonClicked;
  }

  toggleDatasetHidden(index) {
    this.chart.datasets[index].hidden = !this.chart.datasets[index].hidden;
    this.chart.update();
  }

  generateNumber(): number {
    return Math.floor((Math.random()));
  }

  chartClicked({ event, active }: { event?: any, active?: {}[] }): void {
    // @ts-ignore
    const clickedLabelIndex = active[0]?._index;

    // The label value wasn;t clicked
    if (isUndefined(clickedLabelIndex)) {
      return;
    }
    const labelValue = this.chartLabels[clickedLabelIndex];

    this.setToNextPeriod();
    this.fetchDataAndUpdateChart(labelValue);
  }

  private getCacheServerURI(): Promise<any> {
    return this.configurationService.findByPropertyName('statistics.cache-server.uri')
      .pipe(getFirstSucceededRemoteData()).toPromise();
  }

  async getStatisticsDataFromCacheServer(parametersURI): Promise<any> {
    const cacheServerURI = await this.getCacheServerURI()
      .then(res => {
        return res.payload?.values?.[0];
      });

    if (isUndefined(cacheServerURI)) {
      console.error('Cannot load the cache-server URI');
      return;
    }

    return this.http.get(cacheServerURI + parametersURI)
      .pipe().toPromise();
  }

  async fetchAndProcessYearsStatistics() {
    // Get statistics data from the cache server
    const response = await this.getStatisticsDataFromCacheServer('?h=' + this.itemRD$.value.handle + '&period=year')
      .then(res => {
        return res;
      });

    if (isUndefined(response) || isNull(response)) {
      console.error('Cannot get the cache-server statistics data.');
      return;
    }

    // Get views
    const views = response?.views;
    // Get downloads
    const downloads = response?.downloads;

    if (isUndefined(views) || isUndefined(downloads) || isNull(views) || isNull(downloads)) {
      console.error('The response does not contains the `views` or `downloads` property.');
      return;
    }

    // Get labels - year values
    const labelYears = Object.keys(views);

    // If the item has statistics only for one year show the month statistics
    if (labelYears.length === 1) {
      this.setToNextPeriod();
      this.fetchDataAndUpdateChart(undefined);
    }

    // Remove `total` from views and downloads
    const totalIndex = labelYears.indexOf('total');
    labelYears.splice(totalIndex, 1);

    // Get views data
    const totalDataViews = [];
    Object.values(views?.total).forEach((viewData: {}) => {
      // Get only years data
      // @ts-ignore
      if (isUndefined(viewData?.nb_hits)) {
        return;
      }
      // @ts-ignore
      totalDataViews.push(viewData?.nb_hits);
    });

    // Get downloads data
    const totalDataDownloads = [];
    Object.values(downloads?.total).forEach((downloadData: {}) => {
      // Get only years data
      // @ts-ignore
      if (isUndefined(downloadData?.nb_hits)) {
        return;
      }
      // @ts-ignore
      totalDataDownloads.push(downloadData?.nb_hits);
    });

    // Get download files data
    // Go through download statistics and count occurrences of the file downloading
    const filesDownloadsResponse = response.downloads;
    const filesDownloads = this.countFileDownloads(filesDownloadsResponse);
    this.filesDownloads.next(filesDownloads);

    this.updateChartData(labelYears, totalDataViews, totalDataDownloads);
  }

  async fetchAndProcessMonthsStatistics() {
    // Get statistics data from the cache server
    const response = await this.getStatisticsDataFromCacheServer('?h=' + this.itemRD$.value.handle + '&period=month&date=' + this.actualYear)
      .then(res => {
        return res;
      });

    if (isUndefined(response) || isNull(response)) {
      console.error('Cannot get the cache-server statistics data.');
      return;
    }

    // Get views
    const views = response?.views;
    // Get downloads
    const downloads = response?.downloads;

    if (isUndefined(views) || isUndefined(downloads) || isNull(views) || isNull(downloads)) {
      console.error('The response does not contains the `views` or `downloads` property.');
      return;
    }

    // Get month labels
    const monthLabels = [];
    // Month are in the format `[['Feb', 'February']]
    this.months.forEach(monthArray => {
      // Add shortcut of the the month to the label.
      monthLabels.push(monthArray[0]);
    });

    // Get views data
    const totalDataViews = [];
    const totalDataDownloads = [];

    const viewsForActualYear = views?.total?.[this.actualYear];
    const downloadsForActualYear = downloads?.total?.[this.actualYear];
    this.months.forEach((month, index) => {
      // The months are indexed from 1 to 12, not from 0 to 11
      let increasedIndex = index;
      increasedIndex++;

      // View Data
      const monthViewData = viewsForActualYear?.['' + increasedIndex];
      if (isUndefined(monthViewData) || isUndefined(monthViewData?.nb_hits)) {
        totalDataViews.push(0);
      } else {
        // @ts-ignore
        totalDataViews.push(monthViewData?.nb_hits);
      }

      // Download Data
      const monthDownloadData = downloadsForActualYear?.['' + increasedIndex];
      if (isUndefined(monthDownloadData) || isUndefined(monthDownloadData?.nb_hits)) {
        totalDataDownloads.push(0);
      } else {
        // @ts-ignore
        totalDataDownloads.push(monthDownloadData?.nb_hits);
      }
    });

    // Get download files data
    // Go through download statistics and count occurrences of the file downloading for the actual year
    const filesDownloadsResponse = response.downloads[this.actualYear];
    const filesDownloads = this.countFileDownloads(filesDownloadsResponse);
    this.filesDownloads.next(filesDownloads);

    this.updateChartData(monthLabels, totalDataViews, totalDataDownloads);
  }

  async fetchAndProcessDaysStatistics() {
    const actualMonthIndex: number = this.getActualMonthIndex();

    // Get statistics data from the cache server
    const response = await this.getStatisticsDataFromCacheServer('?h=' + this.itemRD$.value.handle + '&period=day&date=' + this.actualYear + '-' + actualMonthIndex)
      .then(res => {
        return res;
      });

    if (isUndefined(response) || isNull(response)) {
      console.error('Cannot get the cache-server statistics data.');
      return;
    }

    // Get views
    const actualDayViews = response.views?.total?.[this.actualYear]?.['' + actualMonthIndex];
    const actualDayDownloads = response.downloads?.total?.[this.actualYear]?.['' + actualMonthIndex];
    if (isUndefined(actualDayViews) || isUndefined(actualDayDownloads) || isNull(actualDayViews) ||
      isNull(actualDayDownloads)) {
      console.error('The response does not contains the `views` or `downloads` property.');
      return;
    }

    const daysOfActualMonth = new Date(Number(this.actualYear), actualMonthIndex - 1, 0).getDate();
    const totalDataViews = [];
    const totalDataDownloads = [];
    const daysArray = [...Array(daysOfActualMonth).keys()];

    daysArray.forEach(day => {
      // Days are indexed from 1 to 31, not from 0
      let dayIndex = day;
      dayIndex++;

      // View Data
      const dayViewData = actualDayViews?.['' + dayIndex];
      if (isUndefined(dayViewData) || isUndefined(dayViewData?.nb_hits)) {
        totalDataViews.push(0);
      } else {
        // @ts-ignore
        totalDataViews.push(dayViewData?.nb_hits);
      }

      // Download Data
      const dayDownloadData = actualDayDownloads?.['' + dayIndex];
      if (isUndefined(dayDownloadData) || isUndefined(dayDownloadData?.nb_hits)) {
        totalDataDownloads.push(0);
      } else {
        // @ts-ignore
        totalDataDownloads.push(dayDownloadData?.nb_hits);
      }
    });

    // Get download files data
    // Go through download statistics and count occurrences of the file downloading for the actual year
    const filesDownloadsResponse = response.downloads[this.actualYear]['' + actualMonthIndex];
    const filesDownloads = this.countFileDownloads(filesDownloadsResponse);
    this.filesDownloads.next(filesDownloads);

    this.updateChartData(daysArray, totalDataViews, totalDataDownloads);
  }

  countFileDownloads(filesDownloadsResponse) {
    let filesDownloads: { [name: string]: number } = {};
    Object.keys(filesDownloadsResponse).forEach(year => {
      const yearDownloadFilesData = filesDownloadsResponse[year];
      if (year === 'total') {
        return;
      }
      Object.keys(yearDownloadFilesData).forEach(fileName => {
        const shortenedFileName = this.getFileNameFromFullURI(fileName);
        const actualValue = isUndefined(filesDownloads[shortenedFileName]) ? 0 : filesDownloads[shortenedFileName];
        filesDownloads[shortenedFileName] = actualValue + yearDownloadFilesData[fileName].nb_hits;
      });
    });

    filesDownloads = this.sortByValue(filesDownloads);
    return filesDownloads;
  }

  getFileNameFromFullURI(fileName) {
    if (isUndefined(fileName)) {
      return undefined;
    }
    // Shortened file name
    return fileName.substr(fileName.lastIndexOf('/') + 1, fileName.indexOf('handle/'));
  }

  sortByValue(dictionary) {
    const sortedData: { [name: string]: number } = {};
    Object.keys(dictionary)
      .sort((a, b) => (dictionary[a] < dictionary[b] ? 1 : -1))
      .map(x => {
        sortedData[x] = dictionary[x];
      });
    return sortedData;
  }

  getActualMonthIndex(): number {
    let actualMonthIndex = 0;
    this.months.forEach((month, index) => {
      if (month[0] === this.actualMonth) {
        actualMonthIndex = index;
      }
    });

    // The month is index from 1 to 12, not from 0 to 11
    actualMonthIndex++;
    return actualMonthIndex;
  }

  fetchDataAndUpdateChart(labelValue) {
    switch (this.actualPeriod) {
      case this.periodYear:
        this.fetchAndProcessYearsStatistics();
        break;
      case this.periodMonth:
        this.actualYear = isUndefined(labelValue) ? this.actualYear : labelValue;
        this.fetchAndProcessMonthsStatistics();
        break;
      case this.periodDay:
        this.actualMonth = labelValue;
        this.fetchAndProcessDaysStatistics();
        break;
      default:
        this.fetchAndProcessYearsStatistics();
        break;
    }
  }

  updateChartMessage(labels) {
    const actualPeriodIndex = this.getActualPeriodIndex();

    this.chartMessage = '';
    // Show years interval
    if (actualPeriodIndex === 0) {
      // Start year and end year
      let lastIndexOfLabels = labels.length;
      this.chartMessage += labels[0] + ' - ' + labels[--lastIndexOfLabels];
    } else if (actualPeriodIndex === 1) {
      this.chartMessage += this.actualYear;
    } else {
      this.chartMessage += this.actualMonth + ', ' + this.actualYear;
    }
  }

  updateChartData(labels, totalDataViews, totalDataDownloads) {
    // Update labels
    this.removeLabels();
    this.setLabels(labels);

    // Update chart message e.g., `Statistics for years 2022 to 2023`, `Statistics for the year 2022`,..
    this.updateChartMessage(labels);

    if (this.chartLabels.datasets) {
      if (this.chartLabels.datasets[0]) {
        // Update view data
        this.chartLabels.datasets[0].data = totalDataViews;
      }
      if (this.chartLabels.datasets[1]) {
        // Update downloads data
        this.chartLabels.datasets[1].data = totalDataDownloads;
      }
    }
    this.chart.update();
  }

  setLabels(labels) {
    labels.forEach(label => {
      this.chartLabels.labels.push(label);
    });
  }

  removeLabels() {
    this.chartLabels.labels = [];
  }
}
