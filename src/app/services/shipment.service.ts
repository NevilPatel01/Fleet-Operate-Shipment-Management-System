import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Shipment, Status } from '../models/shipment.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private shipments = signal<Shipment[]>([]);
  private readonly apiUrl = 'https://kmzgjbpghl.execute-api.us-east-1.amazonaws.com/dev/test';

  readonly sortedShipments = computed(() =>
    [...this.shipments()].sort((a, b) =>
      new Date(a.pickup.pickupDate).getTime() - new Date(b.pickup.pickupDate).getTime()
    )
  );

  constructor(private http: HttpClient) {
    this.loadShipments();
  }

  private loadShipments() {
    this.http.get<Shipment[]>(this.apiUrl)
      .pipe(tap(shipments => this.shipments.set(shipments)))
      .subscribe();
  }

  getShipments(): Observable<any[]> {
    return this.http.get<{ items: any[] }>(this.apiUrl).pipe(
      map((response) => {
        return response.items.map((item) => {
          // Gracefully handle missing or undefined pickup and delivery addresses
          const pickupAddress = item.pickupAddress
            ? item.pickupAddress
            : `${item.pickupStreetAddress || ''}, ${item.pickupCity || ''}, ${item.pickupState || ''}, ${item.pickupZipcode || ''}`;
          
          const deliveryAddress = item.deliveryAddress
            ? item.deliveryAddress
            : `${item.deliveryStreetAddress || ''}, ${item.deliveryCity || ''}, ${item.deliveryState || ''}, ${item.deliveryZipcode || ''}`;
  
          return {
            id: item.id,
            status: item.status || item.Status,
            deliveryDate: item.deliveryDate || item.delivery,
            pickupDate: item.pickupDate || item.pickup,
            deliveryAddress, 
            pickupAddress, 
          };
        });
      })
    );
  }
  
  
// Add a shipment and update the signal
addShipment(shipment: any): Observable<any> {
  const payload = {
    id: shipment.id,
    pickupDate: shipment.pickupDate,
    deliveryDate: shipment.deliveryDate,
    status: shipment.status,
    
    // Flattening pickup address
    pickupStreetAddress: shipment.pickupStreetAddress,
    pickupCity: shipment.pickupCity,
    pickupState: shipment.pickupState,
    pickupZipcode: shipment.pickupZipcode,
    pickupCountry: shipment.pickupCountry,
    
    // Flattening delivery address
    deliveryStreetAddress: shipment.deliveryStreetAddress,
    deliveryCity: shipment.deliveryCity,
    deliveryState: shipment.deliveryState,
    deliveryZipcode: shipment.deliveryZipcode,
    deliveryCountry: shipment.deliveryCountry,
    
    editable: shipment.editable,
  };

  console.log('Sending payload:', payload); // Log the data being sent
  
  // Ensure the endpoint URL is correct here
  return this.http.post(this.apiUrl, payload);
}


  updateShipment(id: string, shipment: Shipment): Observable<Shipment> {
    return this.http.patch<Shipment>(`${this.apiUrl}/${id}`, shipment).pipe(
      tap(updatedShipment => {
        this.shipments.update(shipments =>
          shipments.map(ship => (ship.id === id ? updatedShipment : ship))
        );
      }),
      catchError((error) => {
        console.error('Error updating shipment', error);
        return throwError(error);
      })
    );
  }
  

  removeShipment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}`, { 
      body: { id } 
    }).pipe(
      tap(() => {
        this.shipments.update(shipments =>
          shipments.filter(shipment => shipment.id !== id)
        );
      }),
      catchError((error) => {
        console.error('Error updating shipment', error);
        return throwError(error);
      })
    );
  }  

  private handleError(error: HttpErrorResponse) {
    console.error('There was an error during the API request:', error);
    return throwError(error);
  }
}
