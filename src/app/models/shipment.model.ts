export interface Address {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipcode?: string;
    country?: string;
  }
  
  export interface Pickup {
    pickupDate: string;
    address: Address;
  }
  
  export interface Delivery {
    deliveryDate: string;
    address: Address;
  }
  
  export enum Status {
    Created = 'Created',
    Dispatched = 'Dispatched',
    OnTheWay = 'OnTheWay',
    Delivered = 'Delivered'
  }

  export class ShipmentUpdateData {
    id: string;
    pickupDate?: string;
    deliveryDate?: string;
    status?: Status;
    pickupAddress?: string;
    deliveryAddress?: string;

    constructor(data: Partial<Shipment> = {}) {
      if (data.pickup) {
        this.pickupDate = data.pickup.pickupDate;
        this.pickupAddress = data.pickup.address?.streetAddress;
      }
      if (data.delivery) {
        this.deliveryDate = data.delivery.deliveryDate;
        this.deliveryAddress = data.delivery.address?.streetAddress;
      }
      this.status = data.status || Status.Created;
      this.id = data.id || crypto.randomUUID();
    }
  }
  
  
  export class Shipment {
    id?: string;
    pickup: Pickup;
    delivery: Delivery;
    status: Status;
    editable?: boolean;
  
    constructor(data: Partial<Shipment> = {}) {
      this.pickup = data.pickup || { pickupDate: '', address: {} };
      this.delivery = data.delivery || { deliveryDate: '', address: {} };
      this.status = data.status || Status.Created;
      this.id = data.id || crypto.randomUUID();
    }
  }
  