/* eslint-disable no-unused-expressions */
describe('Editing progress', () => {
  before(() => {
    cy.autologin();
    cy.removeContent('all-of-me', { failOnStatusCode: false });
    cy.removeField('music', 'name', { failOnStatusCode: false });
    cy.removeContentType('music', { failOnStatusCode: false });
    cy.addContentType('music');
    cy.addField('music', {
      name: 'name',
      title: 'Name',
      factory: 'label_text_field',
    });

    cy.createContent({
      contentType: 'music',
      contentId: 'all-of-me',
      contentTitle: 'All of me',
    });
    cy.visit('/all-of-me');
  });
  beforeEach(() => {
    cy.autologin();
    cy.visit('/controlpanel/progress.editing');
  });
  after(() => {
    cy.autologin();
    cy.removeContent('all-of-me', { failOnStatusCode: false });
    cy.removeField('music', 'name', { failOnStatusCode: false });
    cy.removeContentType('music', { failOnStatusCode: false });
  });

  it('should change background color', () => {
    cy.get('#sidebar_music').click({ force: true });
    cy.get('#sidebar_Collection').should(
      'have.css',
      'background-color',
      'rgba(0, 0, 0, 0)',
    );
    cy.get('#sidebar_music').should(
      'have.css',
      'background-color',
      'rgb(173, 216, 230)',
    );
  });
  it('should add and delete property', () => {
    cy.get('#sidebar_music').click({ force: true });
    cy.wait(100);
    cy.get('.dropdown-button').click({ force: true });
    cy.wait(100);
    cy.get('span').contains('Enforce character limits').click({
      force: true,
    });
    cy.get('#property_enforceCharLimits').should('be.visible').click({
      force: true,
    });
    cy.get('#property_content_enforceCharLimits')
      .should('be.visible')
      .within(() => {
        cy.contains('label', 'Link Label').should('be.visible');
        cy.get('input[name="charLimitsLinkLabel"]')
          .clear()
          .type('Fix {title}', { parseSpecialCharSequences: false });
      });

    cy.get('#sidebar_music').click({ force: true });
    cy.wait(100);
    cy.get('#property_enforceCharLimits .cancel.mini.icon').click({
      force: true,
    });
    cy.get('#property_enforceCharLimits').should('not.exist');
  });

  it('should open  json modal', () => {
    cy.get('#json_button').click();
    cy.get('#field-json');
  });
});
