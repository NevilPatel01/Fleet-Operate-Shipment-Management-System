
import { Routes } from '@angular/router';
import { CreateShipmentComponent } from './components/create-shipment/create-shipment.component';
import { ShipmentListComponent } from './components/shipment-list/shipment-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'shipments', pathMatch: 'full' },
  { path: 'create', component: CreateShipmentComponent },
  { path: 'shipments', component: ShipmentListComponent }
];