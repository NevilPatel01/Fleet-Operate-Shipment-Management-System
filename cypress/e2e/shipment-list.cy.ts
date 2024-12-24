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
