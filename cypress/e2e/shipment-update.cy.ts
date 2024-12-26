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
      
      // Assert that the changes are reflected
      cy.get('table tr').eq(1).should('contain', 'New Pickup Address');
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
      
      // Click the delete button of the first shipment
      cy.get('table tr').eq(1).find('button').last().click();
      
      // Assert that the shipment is no longer in the list
      cy.get('table tr').should('not.contain', firstShipmentId);
    });
  });
  