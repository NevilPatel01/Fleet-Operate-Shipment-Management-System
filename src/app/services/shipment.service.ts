import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Shipment, Status } from '../models/shipment.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ShipmentService {
  private apiUrl = 'https://e97wb0y35g.execute-api.us-east-1.amazonaws.com/dev/shipments';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all shipments from the API.
   */
  getShipments(): Observable<Shipment[]> {
    return this.http.get<Shipment[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add a new shipment using the API.
   * @param shipment - The shipment to be added.
   */
  addShipment(shipment: Shipment): Observable<Shipment> {
    return this.http.post<Shipment>(this.apiUrl, shipment, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Update a shipment's status using the API.
   * @param id - Shipment ID.
   * @param status - New status of the shipment.
   */
  updateShipmentStatus(id: string, status: Status): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.patch<void>(url, { status }, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Common error handler.
   * @param error - The HTTP error response.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('An error occurred:', error);

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      console.error('Client-side error:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(`Backend returned code ${error.status}, body was:`, error.error);
    }

    return throwError(() => new Error('Something went wrong; please try again later.'));
  }

  /**
   * HTTP headers.
   */
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
  }
}
