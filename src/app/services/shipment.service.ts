import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Shipment, ShipmentUpdateData, Status } from '../models/shipment.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ShipmentService {
  private shipments = signal<Shipment[]>([]);
  private apiUrl = environment.apiUrl; 

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
          const pickupAddress = item.pickupAddress || 'Address unavailable'; 
          const deliveryAddress = item.deliveryAddress || 'Address unavailable';

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
  
  addShipment(shipment: any): Observable<any> {
    const payload = {
      id: shipment.id,
      pickupDate: shipment.pickupDate,
      deliveryDate: shipment.deliveryDate,
      status: shipment.status,
      
      // Flattening and concatenating addresses
      pickupAddress: shipment.pickupAddress,
      deliveryAddress: shipment.deliveryAddress,
      
      editable: shipment.editable,
    };
  
  
    // Ensure the endpoint URL is correct here
    return this.http.post(this.apiUrl, payload);
  }
  

  updateShipment(id: string, shipment: Shipment): Observable<Shipment> {
    return this.http.patch<Shipment>(`${this.apiUrl}`, shipment).pipe(
      tap(updatedShipment => {
        this.shipments.update(shipments => {
          if (Array.isArray(shipments)) {
            return shipments.map(ship => ship.id === id ? { ...ship, ...updatedShipment } : ship);
          } else {
            console.error('shipments is not an array:', shipments);
            return [];
          }
        });
      }),
      catchError((error) => {
        console.error('Error updating shipment:', error);
        return throwError(() => error);
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
