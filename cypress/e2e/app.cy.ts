describe('Main page', () => {

  beforeEach(() => {
    cy.viewport(320, 650);

    cy.visit(Cypress.env('BASE_URL'));

    // cy.intercept('https://mc.yandex.ru/**', {
    //   statusCode: 204,
    //   body: '',
    // });
    // cy.intercept('https://webvisor.yandex.net/event', {
    //   statusCode: 204,
    //   body: '',
    // });

    Cypress.on('uncaught:exception', (err, runnable) => {
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
    cy.get('.stationSelectorLink').each(($stationLink, index) => {
      cy.wrap($stationLink).click();
      cy.wrap($stationLink).invoke('text').then((linkText) => {
        cy.get('h2').should('have.text', linkText);
      });
    });
  });

});
