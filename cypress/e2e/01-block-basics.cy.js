import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);
  const documentStep = `{
  "Document": [
    {
      "condition": "python:value",
      "hideReady": "False",
      "iconEmpty": "eea-icon eea-icon-edit",
      "iconReady": "eea-icon eea-icon-check",
      "labelEmpty": "Please set the {label} of this {context.portal_type}",
      "labelReady": "You added the {label}",
      "link": "edit#fieldset-default-field-label-progress_test",
      "linkLabel": "Add {label}",
      "prefix": "progress_test",
      "states": [
        "all"
      ]
    }
  ]
}`;

  it('Add Block: Empty', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click();

    cy.getSlate().type('Hello World!');

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    cy.get('#toolbar-personal').click();
    cy.contains('Site Setup').click();

    cy.contains('Editing Progress').click();
    cy.get('#field-progress')
      .dblclick()
      .invoke('val', documentStep)
      .trigger('change')
      .click();

    cy.navigate('/cypress/my-page');

    cy.get('#toolbar-personal').click();
    cy.contains('Site Setup').click();

    cy.contains('Content Types').click();
    cy.get('.ui.dropdown.actions-Document .ellipsis.horizontal.icon').click();

    cy.contains('Schema').click({ force: true });

    cy.get('#addfield').click();

    cy.get('.ui.form .ui.input #field-title')
      .eq(1)
      .click()
      .type('test_progress');
    cy.get('#field-factory').click().type('text');
    cy.get('.react-select__menu ').contains('Text').click({ force: true });
    cy.get('.ui.toggle.checkbox input').click({ force: true });

    cy.get('.actions button[title="Save"]').click();
    cy.get('#toolbar-save').click();

    cy.navigate('/cypress/my-page');

    cy.get('#toolbar-cut-blocks').should('be.visible');
    cy.get('#toolbar-cut-blocks').click();
  });
});
