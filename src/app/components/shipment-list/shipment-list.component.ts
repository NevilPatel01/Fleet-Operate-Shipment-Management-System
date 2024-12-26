import { Component, Input, NgModule, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ShipmentService } from '../../services/shipment.service';
import { Shipment, ShipmentUpdateData, Status } from '../../models/shipment.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shipment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    FormsModule
  ],
  template: `
  <div class="shipment-header">
    <h2>Shipments</h2>
    <button mat-raised-button color="primary" routerLink="/create">Create New Shipment</button>
  </div>

  <table mat-table [dataSource]="shipments" class="mat-elevation-z8">
    <!-- ID Column -->
    <ng-container matColumnDef="id">
      <th mat-header-cell *matHeaderCellDef>ID</th>
      <td mat-cell *matCellDef="let shipment">{{ shipment.id }}</td>
    </ng-container>

    <!-- Pickup Date Column -->
    <ng-container matColumnDef="pickupDate">
      <th mat-header-cell *matHeaderCellDef>Pickup Date</th>
      <td mat-cell *matCellDef="let shipment">
        <input *ngIf="shipment.editable" [(ngModel)]="shipment.pickupDate" type="date" />
        <span *ngIf="!shipment.editable">{{ shipment.pickupDate | date }}</span>
      </td>
    </ng-container>

    <!-- Pickup Address Column -->
    <ng-container matColumnDef="pickupAddress">
      <th mat-header-cell *matHeaderCellDef>Pickup Address</th>
      <td mat-cell *matCellDef="let shipment">
        <input *ngIf="shipment.editable" [(ngModel)]="shipment.pickupAddress" />
        <span *ngIf="!shipment.editable">{{ shipment.pickupAddress }}</span>
      </td>
    </ng-container>

    <!-- Delivery Date Column -->
    <ng-container matColumnDef="deliveryDate">
      <th mat-header-cell *matHeaderCellDef>Delivery Date</th>
      <td mat-cell *matCellDef="let shipment">
        <input *ngIf="shipment.editable" [(ngModel)]="shipment.deliveryDate" type="date" />
        <span *ngIf="!shipment.editable">{{ shipment.deliveryDate | date }}</span>
      </td>
    </ng-container>

    <!-- Delivery Address Column -->
    <ng-container matColumnDef="deliveryAddress">
      <th mat-header-cell *matHeaderCellDef>Delivery Address</th>
      <td mat-cell *matCellDef="let shipment">
        <input *ngIf="shipment.editable" [(ngModel)]="shipment.deliveryAddress" />
        <span *ngIf="!shipment.editable">{{ shipment.deliveryAddress }}</span>
      </td>
    </ng-container>

    <!-- Status Column -->
    <ng-container matColumnDef="status">
      <th mat-header-cell *matHeaderCellDef>Status</th>
      <td mat-cell *matCellDef="let shipment">
        <mat-select
          *ngIf="shipment.editable"
          [(ngModel)]="shipment.status"
        >
          <mat-option *ngFor="let status of statuses" [value]="status">
            {{ status }}
          </mat-option>
        </mat-select>
        <span *ngIf="!shipment.editable">{{ shipment.status }}</span>
      </td>
    </ng-container>

    <!-- Actions Column -->
    <ng-container matColumnDef="actions">
      <th mat-header-cell *matHeaderCellDef>Actions</th>
      <td mat-cell *matCellDef="let shipment">
        <button mat-icon-button color="primary" (click)="toggleEdit(shipment)">
          <mat-icon>{{ shipment.editable ? '✅' : '✏️' }}</mat-icon>
        </button>
        <button mat-icon-button color="warn" (click)="removeShipment(shipment.id)">
          <mat-icon>❌</mat-icon>
        </button>
      </td>
    </ng-container>

    <!-- Header and Row Declarations -->
    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
  </table>
`,
styles: [`
  .shipment-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
  }
`],
})
export class ShipmentListComponent implements OnInit {
  shipments: any[] = [];
  displayedColumns: string[] = [
    'id', 'pickupDate', 'pickupAddress', 'deliveryDate', 'deliveryAddress', 'status', 'actions'
  ];
  statuses = ['In Transit', 'Delivered', 'Created', 'OnTheWay'];

  constructor(private shipmentService: ShipmentService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.shipmentService.getShipments().subscribe({
      next: (shipments) => {
        this.shipments = shipments;
      },
      error: () => {
        this.snackBar.open('Failed to load shipments. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }
  
  toggleEdit(shipment: Shipment) {
    if (!shipment.id) {
      this.snackBar.open('Invalid shipment. No ID found.', 'Close', { duration: 3000 });
      return;
    }
  
    if (shipment.editable) {
      // Directly using the shipment object instead of the helper method
      console.log("Shipment data to send", shipment);
      this.shipmentService.updateShipment(shipment.id, shipment).subscribe({
        next: (updatedShipment) => {
          Object.assign(shipment, updatedShipment);
          this.snackBar.open('Shipment updated successfully!', 'Close', { duration: 3000 });
          shipment.editable = false;
        },
        error: () => {
          this.snackBar.open('Failed to update shipment. Please try again.', 'Close', { duration: 3000 });
        },
      });
    }
    shipment.editable = !shipment.editable;
  }
  
  

  removeShipment(id: string) {
    this.snackBar.open('Shipment removed successfully!', 'Close', { duration: 3000 });
    this.shipments = this.shipments.filter(shipment => shipment.id !== id);
    this.shipmentService.removeShipment(id).subscribe({
      next: () => {
        // Update the local list after successful deletion
        this.shipments = this.shipments.filter(shipment => shipment.id !== id);
      },
    });
  }
}