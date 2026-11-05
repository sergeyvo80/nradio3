const typeDelay = 10;

describe('New station', () => {

  beforeEach(() => {
    cy.viewport(320, 650);

    cy.intercept('https://www.googletagmanager.com/**', {
      statusCode: 204,
      body: '',
    });
    cy.intercept('https://www.google-analytics.com/**', {
      statusCode: 204,
      body: '',
    });

    cy.env(['BASE_URL']).then(({ BASE_URL = 'http://localhost:3002' }) => {
      cy.visit(BASE_URL);
    });

    Cypress.on('uncaught:exception', () => {
      // returning false here prevents Cypress
      // inside the cy.origin() method from failing the test
      return false;
    });
  });


  it('adding a new station', () => {
    const newStationTitle = 'newStation-title';
    cy.get('header .newStationButton').click();
    cy.get('.NewStation input[name="title"').type(newStationTitle, { delay: typeDelay });
    cy.get('.NewStation input[name="stream"').type('newStation-stream', { delay: typeDelay });
    cy.get('.NewStation .addButton').click();
    cy.get('.NewStation .okButton').click();


    let existInList: boolean = false;
    cy.get('.stationSelectorLink').each(($stationLink) => {
      cy.wrap($stationLink).invoke('text').then((linkText) => {
        if (linkText === newStationTitle) {
          existInList = true;
          cy.wrap(existInList).should('be.true');
        }
      });
    });
    
  });

});
