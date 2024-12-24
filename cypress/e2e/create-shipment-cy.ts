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
  
      // Fill out delivery details
      cy.get('input[formControlName="deliveryDate"]').type('2023-12-31');
      cy.get('input[formControlName="streetAddress"]').last().type('456 Delivery St');
      cy.get('input[formControlName="city"]').last().type('Delivery City');
      cy.get('input[formControlName="state"]').last().type('DS');
      cy.get('input[formControlName="zipcode"]').last().type('67890');
      cy.get('input[formControlName="country"]').last().type('Delivery Country');
  
      // Submit the form
      cy.get('button[type="submit"]').click();
  
      // Assert that we're redirected to the shipment list
      cy.url().should('not.include', '/create');
      cy.get('mat-card-title').should('contain', 'Shipments');
    });
  
    it('displays validation errors for required fields', () => {
      cy.get('button[type="submit"]').click();
      cy.get('mat-error').should('be.visible');
    });
  });
  

  // cypress/integration/shipment-list.spec.js

describe('Shipment List', () => {
    beforeEach(() => {
      // Assuming your shipment list is at the root URL
      cy.visit('/');
    });
  
    it('displays the shipment list', () => {
      cy.get('mat-card-title').should('contain', 'Shipments');
      cy.get('table').should('exist');
    });
  
    it('displays shipment details correctly', () => {
      // Assuming there's at least one shipment in the list
      cy.get('tr.mat-row').first().within(() => {
        cy.get('td').eq(0).should('not.be.empty'); // Pickup Date
        cy.get('td').eq(1).should('not.be.empty'); // Pickup Address
        cy.get('td').eq(2).should('not.be.empty'); // Delivery Date
        cy.get('td').eq(3).should('not.be.empty'); // Delivery Address
        cy.get('td').eq(4).find('mat-chip-option').should('exist'); // Status
      });
    });
  
    it('allows editing a shipment', () => {
      cy.get('tr.mat-row').first().within(() => {
        cy.get('button[color="primary"]').click();
      });
      // Add assertions for edit functionality once implemented
      cy.url().should('include', '/edit');
    });
  
    it('allows removing a shipment', () => {
      cy.get('tr.mat-row').its('length').then((initialCount) => {
        cy.get('tr.mat-row').first().within(() => {
          cy.get('button[color="warn"]').click();
        });
        cy.get('tr.mat-row').should('have.length', initialCount - 1);
      });
    });
  
    it('navigates to create new shipment page', () => {
      cy.contains('Create New Shipment').click();
      cy.url().should('include', '/create');
    });
  });
  