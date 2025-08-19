const typeDelay = 10;

describe('New station', () => {

  beforeEach(() => {
    cy.viewport(320, 650);

    cy.visit(Cypress.env('BASE_URL'));

    cy.intercept('https://www.googletagmanager.com/**', {
      statusCode: 204,
      body: '',
    });
    cy.intercept('https://www.google-analytics.com/**', {
      statusCode: 204,
      body: '',
    });

    Cypress.on('uncaught:exception', (err, runnable) => {
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
