describe('Main page', () => {

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

  it('should contain important blocks', () => {    
    cy.get('h1').contains('NRadio');
    cy.get('h2').contains('Groove Salad [SomaFM]');
  });

  it('clicks to first station link and verifies h2 content', () => {
    const stationLink = cy.get('.stationSelectorLink').first();

    stationLink.then(($link) => {
      const linkText = $link.text();
      stationLink.click();
      cy.get('h2').should('have.text', linkText);
    });
  });

  it('clicks to station links and verifies h2 content', () => {
    cy.get('.stationSelectorLink').each(($stationLink) => {
      cy.wrap($stationLink).click();
      cy.wrap($stationLink).invoke('text').then((linkText) => {
        cy.get('h2').should('have.text', linkText);
      });
    });
  });

});
