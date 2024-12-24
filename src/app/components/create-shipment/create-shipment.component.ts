// create-shipment.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Shipment, Status } from '../../models/shipment.model';
import { ShipmentService } from '../../services/shipment.service';

@Component({
  selector: 'app-create-shipment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule
  ],
  template: `
    <mat-card class="shipment-card">
      <mat-card-header>
        <mat-card-title>Create Shipment</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form [formGroup]="shipmentForm" (ngSubmit)="onSubmit()" class="shipment-form">
          <div class="form-section" formGroupName="pickup">
            <h3>Pickup Details</h3>
            <div class="form-row">
              <mat-form-field>
                <mat-label>Pickup Date</mat-label>
                <input matInput type="date" formControlName="pickupDate">
                <mat-error *ngIf="shipmentForm.get('pickup.pickupDate')?.errors?.['required']">
                  Pickup date is required
                </mat-error>
              </mat-form-field>
            </div>
            
            <div formGroupName="address" class="address-section">
              <mat-form-field>
                <mat-label>Street Address</mat-label>
                <input matInput formControlName="streetAddress">
              </mat-form-field>

              <mat-form-field>
                <mat-label>City</mat-label>
                <input matInput formControlName="city">
              </mat-form-field>

              <mat-form-field>
                <mat-label>State</mat-label>
                <input matInput formControlName="state">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Zipcode</mat-label>
                <input matInput formControlName="zipcode">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Country</mat-label>
                <input matInput formControlName="country">
              </mat-form-field>
            </div>
          </div>

          <div class="form-section" formGroupName="delivery">
            <h3>Delivery Details</h3>
            <div class="form-row">
              <mat-form-field>
                <mat-label>Delivery Date</mat-label>
                <input matInput type="date" formControlName="deliveryDate">
                <mat-error *ngIf="shipmentForm.get('delivery.deliveryDate')?.errors?.['required']">
                  Delivery date is required
                </mat-error>
              </mat-form-field>
            </div>
            
            <div formGroupName="address" class="address-section">
              <mat-form-field>
                <mat-label>Street Address</mat-label>
                <input matInput formControlName="streetAddress">
              </mat-form-field>

              <mat-form-field>
                <mat-label>City</mat-label>
                <input matInput formControlName="city">
              </mat-form-field>

              <mat-form-field>
                <mat-label>State</mat-label>
                <input matInput formControlName="state">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Zipcode</mat-label>
                <input matInput formControlName="zipcode">
              </mat-form-field>

              <mat-form-field>
                <mat-label>Country</mat-label>
                <input matInput formControlName="country">
              </mat-form-field>
            </div>
          </div>

          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit" [disabled]="!shipmentForm.valid">
              Create Shipment
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .shipment-card {
      max-width: 800px;
      margin: 20px auto;
      padding: 20px;
    }

    .shipment-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-section {
      margin-bottom: 20px;
    }

    .form-row {
      margin-bottom: 15px;
    }

    .address-section {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    mat-form-field {
      width: 100%;
    }

    .form-actions {
      margin-top: 20px;
      text-align: right;
    }
  `]
})
export class CreateShipmentComponent implements OnInit {
  shipmentForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private shipmentService: ShipmentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
    // Any additional initialization if needed
  }

  private initForm() {
    this.shipmentForm = this.fb.group({
      pickup: this.fb.group({
        pickupDate: ['', [Validators.required]],
        address: this.createAddressFormGroup()
      }),
      delivery: this.fb.group({
        deliveryDate: ['', [Validators.required]],
        address: this.createAddressFormGroup()
      })
    });
  }

  private createAddressFormGroup() {
    return this.fb.group({
      streetAddress: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipcode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.shipmentForm.valid) {
      const formValue = this.shipmentForm.value;
      const shipment: Shipment = {
        pickup: formValue.pickup,
        delivery: formValue.delivery,
        status: Status.Created,
      };
  
      this.shipmentService.addShipment(shipment).subscribe({
        next: () => {
          this.snackBar.open('Shipment Created Successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/shipments']);
        },
        error: (err) => {
          console.error('Failed to create shipment', err);
          this.snackBar.open('Failed to Create Shipment', 'Close', { duration: 3000 });
        },
      });
    }
  }
  
  

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}