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
      "link": "edit#fieldset-default-field-label-test_progress",
      "linkLabel": "Add {label}",
      "prefix": "test_progress",
      "states": [
        "all"
      ]
    },
     {
      "condition": "python:value",
      "hideReady": "False",
      "iconEmpty": "eea-icon eea-icon-edit",
      "iconReady": "eea-icon eea-icon-check",
      "labelEmpty": "Please set the {label} of this {context.portal_type}",
      "labelReady": "You added the {label}",
      "link": "edit#fieldset-default-field-label-test_progress_2",
      "linkLabel": "Add {label}",
      "prefix": "test_progress_2",
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
      .click()
      .type('{enter}');

    cy.get('#toolbar-save').click();

    cy.navigate('/cypress/my-page');

    cy.get('#toolbar-personal').click();
    cy.contains('Site Setup').click();

    cy.contains('Content Types').click();
    cy.get('.ui.dropdown.actions-Document .ellipsis.horizontal.icon').click();

    cy.get('.ui.active.visible.dropdown.actions-Document .item')
      .contains('Schema')
      .click();

    cy.get('#addfield').click();

    cy.get('.ui.form .ui.input #field-title')
      .eq(1)
      .click()
      .type('test_progress');
    cy.get('#field-factory').click().type('text');
    cy.get('.react-select__menu ').contains('Text').click({ force: true });

    cy.get('.inline.field.field-wrapper-required input').click({ force: true });
    cy.get('.actions button[title="Save"]').click();

    cy.get('.tabular.menu .item-add').click();
    cy.get('.modal .ui.input #field-title').click().type('Test Progress');
    cy.get('#field-id').click({ force: true }).type('testing');
    cy.get('.actions button[aria-label="Save"]').click();

    cy.get('.tabular.menu .item').contains('Test Progress').click();
    cy.get('#addfield').click();

    cy.get('.ui.form .ui.input #field-title').click().type('test_progress_2');
    cy.get('#field-factory').click().type('text');
    cy.get('.react-select__menu ').contains('Text').click({ force: true });

    cy.get('.inline.field.field-wrapper-required input').click({
      force: true,
    });
    cy.get('.actions button[title="Save"]').click();

    cy.get('#toolbar-save').click();

    cy.navigate('/cypress/my-page');

    cy.get('#toolbar-cut-blocks').should('be.visible');
    cy.get('#toolbar-cut-blocks').click();

    cy.get('.progress__title').should('contain', '2 fields missing');
    cy.get('.progress__title button').click();
    cy.get('.progress__title').should('contain', 'Add test_progress');
    cy.get('.progress__title').should('contain', 'Add test_progress_2');
    cy.get('.progress__title ul li a').contains('Add test_progress').click();

    cy.url().should('include', '#fieldset-default-field-label-test_progress');

    cy.get('.field-wrapper-test_progress div[role="textbox"] p').type('test');
    cy.get('.field-wrapper-test_progress_2 div[role="textbox"] p').type('test');

    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    cy.get('#toolbar-personal').click();
    cy.contains('Site Setup').click();

    cy.contains('Editing Progress').click();
    cy.get('#field-progress')
      .dblclick()
      .invoke('val', `{}`)
      .click()
      .type('{enter}');

    cy.get('#toolbar-save').click();
    cy.navigate('/cypress/my-page');

    cy.get('#toolbar-personal').click();
    cy.contains('Site Setup').click();

    cy.contains('Content Types').click();
    cy.get('.ui.dropdown.actions-Document .ellipsis.horizontal.icon').click();

    cy.get('.ui.active.visible.dropdown.actions-Document .item')
      .contains('Schema')
      .click();

    cy.get(
      '.field-wrapper-test_progress .toolbar button[aria-label="Delete"]',
    ).click();

    cy.get('.actions .primary.button').contains('OK').click();
    cy.get('#toolbar-save').click();
  });
});
