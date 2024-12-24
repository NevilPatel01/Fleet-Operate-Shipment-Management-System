import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
    RouterLink,
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
        <mat-select 
          [value]="shipment.status" 
          (selectionChange)="updateStatus(shipment.id!, $event.value)"
          panelWidth="fit-content">
          <mat-option *ngFor="let status of statusOptions" [value]="status">
            {{status}}
          </mat-option>
        </mat-select>

        </td>
      </ng-container>

      <ng-container matColumnDef="actions" panelWidth="fit-content" panelHeight="fit-content">
        <th mat-header-cell *matHeaderCellDef> Actions </th>
        <td mat-cell *matCellDef="let shipment">
          <button mat-icon-button color="primary" panelWidth="fit-content" (click)="editShipment(shipment.id!)">
            <mat-icon  class="custom-icon"  panelWidth="fit-content">✏️</mat-icon>
          </button>
          <button mat-icon-button color="warn" panelWidth="fit-content" (click)="removeShipment(shipment.id!)">
            <mat-icon class="custom-icon"  panelWidth="fit-content" panelHeight="fit-content">❌</mat-icon>
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
  `,
  styles: [/* ... (styles remain the same) ... */]
})
export class ShipmentListComponent {
  displayedColumns = ['pickupDate', 'pickupAddress', 'deliveryDate', 'deliveryAddress', 'status', 'actions'];
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

  editShipment(id: string) {
    console.log(`Edit shipment with id: ${id}`);
  }

  removeShipment(id: string) {
    this.shipmentService.removeShipment(id);
  }
}
