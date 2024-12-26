// cypress/integration/create-shipment.spec.js

describe('Create Shipment', () => {
    beforeEach(() => {
      cy.visit('/create');
    });
  
    it('displays the create shipment form', () => {
      cy.get('mat-card-title').should('contain', 'Create Shipment');
      cy.get('form').should('exist');
    });
  
    it('allows filling out the shipment form', () => {
      // Fill out pickup details
      cy.get('input[formControlName="pickupDate"]').type('2023-12-25');
      cy.get('input[formControlName="streetAddress"]').first().type('123 Pickup St');
      cy.get('input[formControlName="city"]').first().type('Pickup City');
      cy.get('input[formControlName="state"]').first().type('PS');
      cy.get('input[formControlName="zipcode"]').first().type('12345');
      cy.get('input[formControlName="country"]').first().type('Pickup Country');
      cy.wait(2000);
  
      // Fill out delivery details
      cy.get('input[formControlName="deliveryDate"]').type('2023-12-31');
      cy.get('input[formControlName="streetAddress"]').last().type('456 Delivery St');
      cy.get('input[formControlName="city"]').last().type('Delivery City');
      cy.get('input[formControlName="state"]').last().type('DS');
      cy.get('input[formControlName="zipcode"]').last().type('67890');
      cy.get('input[formControlName="country"]').last().type('Delivery Country');
      cy.wait(2000);
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
    });

  });
  

  describe('Shipment List', () => {
    it('should edit the first shipment', () => {
      cy.visit('/');
      
      // Click the edit button of the first shipment
      cy.get('table tr').eq(1).find('button').first().click();
      
      // Edit the pickup address
      cy.get('table tr').eq(1).find('input').eq(1).clear().type('New Pickup Address');
      
      // Edit the status
      cy.get('table tr').eq(1).find('mat-select').click();
      cy.get('mat-option').contains('Delivered').click();
      
      // Save the changes
      cy.get('table tr').eq(1).find('button').first().click();
      
      cy.wait(2000);
      // Assert that the changes are reflected
      cy.get('table tr').eq(1).should('contain', 'New Pickup Address');
      cy.wait(2000);
      cy.get('table tr').eq(1).should('contain', 'Delivered');

    });
  });
  
  describe('Shipment List', () => {
    it('should delete the first shipment', () => {
      cy.visit('/');
      
      // Store the ID of the first shipment
      let firstShipmentId;
      cy.get('table tr').eq(1).find('td').first().invoke('text').then((id) => {
        firstShipmentId = id;
      });
      
      cy.wait(2000);
      // Click the delete button of the first shipment
      cy.get('table tr').eq(1).find('button').last().click();
      // Assert that the shipment is no longer in the list
      cy.get('table tr').should('not.contain', firstShipmentId);
    });
  });
  