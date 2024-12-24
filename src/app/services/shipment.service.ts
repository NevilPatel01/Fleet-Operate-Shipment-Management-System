// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
// import { Shipment, Status } from '../models/shipment.model';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class ShipmentService {
//   private apiUrl = 'https://<sdf>.execute-api.<1>.amazonaws.com/dev/<1>';

//   constructor(private http: HttpClient) {}

//   /**
//    * Fetch all shipments from the API.
//    */
//   getShipments(): Observable<Shipment[]> {
//     return this.http.get<Shipment[]>(this.apiUrl).pipe(
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * Add a new shipment using the API.
//    * @param shipment - The shipment to be added.
//    */
//   addShipment(shipment: Shipment): Observable<Shipment> {
//     return this.http.post<Shipment>(this.apiUrl, shipment, this.getHttpOptions()).pipe(
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * Update a shipment's status using the API.
//    * @param id - Shipment ID.
//    * @param status - New status of the shipment.
//    */
//   updateShipmentStatus(id: string, status: Status): Observable<void> {
//     const url = `${this.apiUrl}/${id}`;
//     return this.http.patch<void>(url, { status }, this.getHttpOptions()).pipe(
//       catchError(this.handleError)
//     );
//   }

//   /**
//    * Common error handler.
//    * @param error - The HTTP error response.
//    */
//   private handleError(error: HttpErrorResponse): Observable<never> {
//     console.error('An error occurred:', error);

//     if (error.error instanceof ErrorEvent) {
//       // A client-side or network error occurred
//       console.error('Client-side error:', error.error.message);
//     } else {
//       // The backend returned an unsuccessful response code
//       console.error(`Backend returned code ${error.status}, body was:`, error.error);
//     }

//     return throwError(() => new Error('Something went wrong; please try again later.'));
//   }

//   /**
//    * HTTP headers.
//    */
//   private getHttpOptions() {
//     return {
//       headers: new HttpHeaders({
//         'Content-Type': 'application/json',
//       }),
//     };
//   }
// }

import { Injectable, signal, computed } from '@angular/core';
import { Shipment, Status } from '../models/shipment.model';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private shipments = signal<Shipment[]>([]);

  readonly sortedShipments = computed(() => 
    [...this.shipments()].sort((a, b) => 
      new Date(a.pickup.pickupDate).getTime() - new Date(b.pickup.pickupDate).getTime()
    )
  );

  constructor() {
    this.loadShipmentsFromStorage();
  }

  private loadShipmentsFromStorage() {
    const storedShipments = localStorage.getItem('shipments');
    if (storedShipments) {
      this.shipments.set(JSON.parse(storedShipments));
    }
  }

  private saveShipmentsToStorage() {
    localStorage.setItem('shipments', JSON.stringify(this.shipments()));
  }

  addShipment(shipment: Shipment): void {
    this.shipments.update(ships => [...ships, new Shipment(shipment)]);
    this.saveShipmentsToStorage();
  }

  updateShipmentStatus(id: string, status: Status): void {
    this.shipments.update(ships => 
      ships.map(ship => 
        ship.id === id ? { ...ship, status } : ship
      )
    );
    this.saveShipmentsToStorage();
  }

  removeShipment(id: string): void {
    this.shipments.update(ships => ships.filter(ship => ship.id !== id));
    this.saveShipmentsToStorage();
  }
}
