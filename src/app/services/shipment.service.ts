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

  addShipment(shipment: Shipment): void {
    this.shipments.update(ships => [...ships, new Shipment(shipment)]);
  }

  updateShipmentStatus(id: string, status: Status): void {
    this.shipments.update(ships => 
      ships.map(ship => 
        ship.id === id ? { ...ship, status } : ship
      )
    );
  }
}