import { Component, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TripsFacadeApiService } from '../commons/facade/trips-facade-api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-join-trip-dailog',
  templateUrl: './join-trip-dailog.component.html',
  styleUrls: ['./join-trip-dailog.component.scss']
})
export class JoinTripDailogComponent {
  @Input() id: number;

  constructor(

    public dialogRef: MatDialogRef<JoinTripDailogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public tripsFacadeApiService: TripsFacadeApiService,
    private route: Router
  ) { }

  ngOnInit(): void {

  }

  sendresquest() {
    debugger
    let tripId = this.data.tripid == "" ? 0 : this.data.tripid == undefined ? 0 : this.data.tripid == null ? 0 : this.data.tripid;
    this.tripsFacadeApiService.tripsJoinTripIdPost(tripId).pipe().subscribe((data) => {
      if (data.status === 1) {
        debugger
        Swal.fire({
          title: "Request Sent",
          text: data.message,
          confirmButtonText: "OK",
          icon: "success"
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.route.navigate(['/feeds']).then(() => {
              location.reload();
            });
          }
        });
        console.log("jointrip", data);
        this.close();
        // this.route.navigate(['/feeds']).then(() => {
        //   location.reload();
        // });
       
      }
    }, (error) => {
      this.route.navigate(['/login']);
      this.close();
      // Handle the error here, for example, redirect to an error page or show a message to the user.
    }
    );

  }

  close(): void {
    this.dialogRef.close();
  }
}
