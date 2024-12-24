describe('Create Shipment Component', () => {
    beforeEach(() => {
      cy.visit('/create'); // Adjust according to your routing setup
    });
  
    it('should display form fields', () => {
      // Verify if all form fields are visible
      cy.get('input[formControlName="pickupDate"]').should('be.visible');
      cy.get('input[formControlName="streetAddress"]').should('be.visible');
      cy.get('input[formControlName="city"]').should('be.visible');
      cy.get('input[formControlName="zipcode"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  
    it('should validate required fields and submit the form', () => {
      cy.get('input[formControlName="pickupDate"]').type('2024-12-25');
      cy.get('input[formControlName="streetAddress"]').type('789 Oak St');
      cy.get('input[formControlName="city"]').type('Smalltown');
      cy.get('input[formControlName="zipcode"]').type('10003');
      cy.get('input[formControlName="country"]').type('USA');
      
      // Submit the form
      cy.get('button[type="submit"]').click();
      
      // Wait for the backend response and confirm the success message appears
      cy.get('.mat-snack-bar-container').should('contain', 'Shipment Created Successfully');
      
      // Ensure the app navigates to the shipment list
      cy.url().should('include', '/shipments');
    });
  
    it('should show validation errors when the form is incomplete', () => {
      cy.get('button[type="submit"]').click();
      
      // Check for validation error messages
      cy.get('mat-error').should('be.visible');
    });
  });
  