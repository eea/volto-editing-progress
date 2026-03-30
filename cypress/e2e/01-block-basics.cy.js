import { slateBeforeEach, slateAfterEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(slateAfterEach);

  it('Add Block: Empty', () => {
    // Change page title
    cy.clearSlateTitle();
    cy.getSlateTitle().type('My Add-on Page');

    cy.get('.documentFirstHeading').contains('My Add-on Page');

    cy.getSlate().click();

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    cy.get('.blocks-chooser .title').contains('Media').click();
    cy.get('.content.active.media .button.image').contains('Image').click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Add-on Page');
    cy.get('.block.image');
  });
});

describe('Editing Progress Workflow', () => {
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

  before(() => {
    cy.autologin();
    // Clean up any leftover state from previous runs
    cy.removeField('Document', 'test_progress', { failOnStatusCode: false });
    cy.removeField('Document', 'test_progress_2', { failOnStatusCode: false });
    cy.removeContent('cypress', { failOnStatusCode: false });

    // Create the fixtures before adding required fields so the setup itself
    // is not blocked by validation and the edit form still shows them as
    // missing values.
    cy.createContent({
      contentType: 'Document',
      contentId: 'cypress',
      contentTitle: 'Cypress',
    });
    cy.createContent({
      contentType: 'Document',
      contentId: 'test-progress',
      contentTitle: 'Test Progress',
      path: 'cypress',
    });

    // Add required DX fields to Document type
    cy.addField('Document', {
      name: 'test_progress',
      title: 'test_progress',
      factory: 'Text line (String)',
      required: true,
    });
    cy.addField('Document', {
      name: 'test_progress_2',
      title: 'test_progress_2',
      factory: 'Text line (String)',
      required: true,
    });
  });

  after(() => {
    cy.autologin();
    cy.removeContent('cypress', { failOnStatusCode: false });
    cy.removeField('Document', 'test_progress', { failOnStatusCode: false });
    cy.removeField('Document', 'test_progress_2', { failOnStatusCode: false });
  });

  it('should configure editing progress and verify progress bar', () => {
    cy.autologin();

    // Navigate to Editing Progress control panel
    cy.visit('/controlpanel');
    cy.contains('Editing Progress').click();
    cy.contains('Edit JSON').click();

    // Set the editing progress JSON config
    cy.get('#field-json').should('be.visible');
    cy.get('#field-json')
      .should('be.visible')
      .should('be.enabled')
      .dblclick()
      .invoke('val', `test:test`)
      .click()
      .type('{enter}');

    cy.get('#field-json').should('be.visible');
    cy.get('#field-json')
      .should('be.visible')
      .should('be.enabled')
      .type('{ctrl}', { release: false });

    cy.get('#field-json').trigger('keydown', { keyCode: 65, which: 65 });

    cy.get('#field-json').invoke('val', documentStep).type('{enter}');

    cy.get('.actions .ui.basic.circular.primary.right.floated.button').click();

    cy.get('#toolbar-save').click();

    // Navigate to test page and verify editing progress
    cy.navigate('/cypress/test-progress');

    cy.get('#toolbar-cut-blocks').should('be.visible');
    cy.get('#toolbar-cut-blocks').click();

    cy.get('.progress__title').should('contain', '2 fields missing');
    cy.get('.progress__title button').click();
    cy.get('.progress__title').should('contain', 'Add test_progress');
    cy.get('.progress__title').should('contain', 'Add test_progress_2');
    cy.get('.progress__title ul li a').contains('Add test_progress').click();

    cy.url().should('include', '#fieldset-default-field-label-test_progress');

    cy.get('#field-test_progress').should('be.visible').clear().type('test');
    cy.get('#field-test_progress_2')
      .should('be.visible')
      .clear()
      .type('test');

    cy.get('#toolbar-save').click();
    cy.url().should(
      'eq',
      Cypress.config().baseUrl + '/cypress/test-progress',
    );

    // Clean up the editing progress config via UI
    cy.get('#toolbar-personal').click();
    cy.contains('Site Setup').click();

    cy.contains('Editing Progress').click();
    cy.contains('Edit JSON').click();
    cy.get('#field-json').should('be.visible');
    cy.get('#field-json')
      .should('be.visible')
      .should('be.enabled')
      .type('{ctrl}', { release: false });

    cy.get('#field-json').trigger('keydown', { keyCode: 65, which: 65 });

    cy.get('#field-json').invoke('val', '{}').click().type('{enter}');

    cy.get('.actions .ui.basic.circular.primary.right.floated.button').click();

    cy.get('#toolbar-save').click();
  });
});
