import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ShipmentService } from '../../services/shipment.service';
import { Status, Address } from '../../models/shipment.model';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink
  ],
  template: `
    <div class="shipment-header">
      <h2>Shipments</h2>
      <button mat-raised-button color="primary" routerLink="/create">Create New Shipment</button>
    </div>

    <table mat-table [dataSource]="shipmentService.sortedShipments()" class="mat-elevation-z8">
      <ng-container matColumnDef="pickupDate">
        <th mat-header-cell *matHeaderCellDef> Pickup Date </th>
        <td mat-cell *matCellDef="let shipment"> {{shipment.pickup.pickupDate | date}} </td>
      </ng-container>

      <ng-container matColumnDef="pickupAddress">
        <th mat-header-cell *matHeaderCellDef> Pickup Address </th>
        <td mat-cell *matCellDef="let shipment"> {{formatAddress(shipment.pickup.address)}} </td>
      </ng-container>

      <ng-container matColumnDef="deliveryDate">
        <th mat-header-cell *matHeaderCellDef> Delivery Date </th>
        <td mat-cell *matCellDef="let shipment"> {{shipment.delivery.deliveryDate | date}} </td>
      </ng-container>

      <ng-container matColumnDef="deliveryAddress">
        <th mat-header-cell *matHeaderCellDef> Delivery Address </th>
        <td mat-cell *matCellDef="let shipment"> {{formatAddress(shipment.delivery.address)}} </td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef> Status </th>
        <td mat-cell *matCellDef="let shipment">
          <mat-select [value]="shipment.status" (selectionChange)="updateStatus(shipment.id!, $event.value)">
            <mat-option *ngFor="let status of statusOptions" [value]="status">
              {{status}}
            </mat-option>
          </mat-select>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [`
    .shipment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
    }

    .mat-mdc-row .mat-mdc-cell {
      border-bottom: 1px solid transparent;
      border-top: 1px solid transparent;
    }

    .mat-mdc-row:hover .mat-mdc-cell {
      background-color: rgba(0, 0, 0, 0.04);
    }
  `]
})
export class ShipmentListComponent {
  displayedColumns = ['pickupDate', 'pickupAddress', 'deliveryDate', 'deliveryAddress', 'status'];
  statusOptions = Object.values(Status);

  constructor(public shipmentService: ShipmentService) {}

  updateStatus(id: string, status: Status) {
    this.shipmentService.updateShipmentStatus(id, status);
  }

  formatAddress(address: Address): string {
    const parts = [
      address.streetAddress,
      address.city,
      address.state,
      address.zipcode,
      address.country
    ].filter(Boolean);
    return parts.join(', ');
  }
}