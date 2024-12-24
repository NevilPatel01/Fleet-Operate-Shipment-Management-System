describe('Shipment List Component', () => {
    beforeEach(() => {
      // Add mock data to load on component mount
      cy.intercept('GET', '/api/shipments', {
        statusCode: 200,
        body: [
          {
            id: '1',
            pickup: {
              pickupDate: '2024-12-23',
              address: { streetAddress: '123 Main St', city: 'Metropolis', state: 'NY', zipcode: '10001', country: 'USA' }
            },
            delivery: {
              deliveryDate: '2024-12-24',
              address: { streetAddress: '456 Elm St', city: 'Gotham', state: 'NY', zipcode: '10002', country: 'USA' }
            },
            status: 'Created'
          }
        ]
      }).as('getShipments');
      
      cy.visit('/shipments'); // Adjust according to your routing setup
    });
  
    it('should render shipments in table', () => {
      cy.wait('@getShipments');
      
      // Check if the table is rendered
      cy.get('table').should('be.visible');
      
      // Validate that shipment data is displayed correctly
      cy.get('td').first().contains('2024-12-23'); // Pickup Date
      cy.get('td').eq(1).contains('123 Main St'); // Pickup Address
      cy.get('td').eq(2).contains('2024-12-24'); // Delivery Date
      cy.get('td').eq(3).contains('456 Elm St'); // Delivery Address
    });
  
    it('should navigate to create shipment form when "Create New Shipment" is clicked', () => {
      cy.get('button').contains('Create New Shipment').click();
      cy.url().should('include', '/create'); // Adjust if URL for create shipment form is different
    });
  });
  