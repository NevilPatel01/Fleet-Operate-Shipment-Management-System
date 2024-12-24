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
  });
});
