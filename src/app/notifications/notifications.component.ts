import { Component } from '@angular/core';
import { HeaderService } from '../commons/services/Header/header.service';
import { NotificationApiFacadeService } from '../commons/facade/notification-api-facade.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  page:number = 1;
  itemsPerPage:number = 3;
  maxPage:any = 1;
  notification : any[] = [];
  totalNotification:any;

  constructor(private headerService: HeaderService,
   public NotificationApiFacadeService : NotificationApiFacadeService) {
    this.headerService.showHeader = true; // Hide the header in HomeComponent
    this.notificationloadData();
  }

  ngOnInit(): void {
    this.notificationloadData();
  }
  
  notificationloadData() {
 
    if (this.maxPage >= this.page) {
      this.NotificationApiFacadeService.notificationsGet(this.page, this.itemsPerPage).pipe().subscribe((response) => {
        console.log(response);
        this.totalNotification= response.data.total;
        this.maxPage = Math.ceil(this.totalNotification / this.itemsPerPage);
        this.notification = this.notification.concat(response.data.notifications);
        
        this.page++;
      });
    }

  }

  onScroll() {
    this.notificationloadData();
  }

  getFirstLetter(name: string): string {
    // Ensure name is not empty before extracting the first letter
    if (name && name.length > 0) {
      return name[0].toUpperCase();
    }
    return ''; // Handle empty name case
  }

  getColor(index: number): string {
    // Add your logic to determine colors based on the index
    const colors = ['#9BA37E', '#FF5733', '#3498db', '#e74c3c'];
    return colors[index % colors.length];
  }
  
}

