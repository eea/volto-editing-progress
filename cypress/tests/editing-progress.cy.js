/* eslint-disable no-unused-expressions */
describe('Editing progress', () => {
  const selectContentType = (contentTypeId) => {
    cy.get('input[placeholder="Search... "]')
      .should('be.visible')
      .clear()
      .type(contentTypeId);

    cy.get(`#sidebar_${contentTypeId}`)
      .should('be.visible')
      .scrollIntoView()
      .click();

    cy.get(`#sidebar_${contentTypeId}`).should(
      'have.css',
      'background-color',
      'rgb(173, 216, 230)',
    );

    cy.get('.dropdown-button').should('be.visible');
  };

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
    cy.get('#json_button').should('be.visible');
    cy.get('input[placeholder="Search... "]').should('be.visible');
  });
  after(() => {
    cy.autologin();
    cy.removeContent('all-of-me', { failOnStatusCode: false });
    cy.removeField('music', 'name', { failOnStatusCode: false });
    cy.removeContentType('music', { failOnStatusCode: false });
  });

  it('should change background color', () => {
    selectContentType('music');
  });

  it('should add and delete property', () => {
    selectContentType('music');

    cy.get('.dropdown-button').should('be.visible').click();
    cy.contains('.visible.menu .item', 'Enforce character limits')
      .should('be.visible')
      .click();

    cy.get('#property_enforceCharLimits').should('be.visible').click();
    cy.get('#property_content_enforceCharLimits')
      .should('be.visible')
      .within(() => {
        cy.contains('label', 'Link Label').should('be.visible');
        cy.get('input[name="charLimitsLinkLabel"]')
          .clear()
          .type('Fix {title}', { parseSpecialCharSequences: false });
      });

    cy.get('#property_enforceCharLimits .cancel.mini.icon')
      .should('be.visible')
      .click();
    cy.get('#property_enforceCharLimits').should('not.exist');
  });

  it('should open  json modal', () => {
    cy.get('#json_button').click();
    cy.get('#field-json').should('be.visible');
  });
});
