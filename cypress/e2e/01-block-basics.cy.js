import { slateBeforeEach } from '../support/e2e';

describe('Blocks Tests', () => {
  beforeEach(slateBeforeEach);
  afterEach(() => {
    cy.autologin();
    cy.removeContent('cypress', { failOnStatusCode: false });
  });
  afterEach(() => {
    cy.autologin();
    cy.removeField('Document', 'test_progress', { failOnStatusCode: false });
    cy.removeField('Document', 'test_progress_2', {
      failOnStatusCode: false,
    });
  });
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

    cy.get('#toolbar-add').click();
    cy.get('#toolbar-add-document').click();
    cy.clearSlateTitle();
    cy.getSlateTitle().type('Test Progress');
    cy.get('.documentFirstHeading').contains('Test Progress');
    cy.get('#toolbar-save').click();

    cy.visit('/controlpanel/progress.editing');
    cy.contains('Edit JSON').click();

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

    cy.navigate('/cypress/my-page');

    cy.autologin();
    cy.removeField('Document', 'test_progress', { failOnStatusCode: false });
    cy.removeField('Document', 'test_progress_2', { failOnStatusCode: false });
    cy.addField('Document', {
      name: 'test_progress',
      factory: 'label_text_field',
      required: true,
    });
    cy.addField('Document', {
      name: 'test_progress_2',
      factory: 'label_text_field',
      required: true,
    });

    cy.navigate('/cypress/my-page/test-progress');

    cy.contains('button.ep-sidenav-btn', '2 fields missing').click({
      force: true,
    });
    cy.get('.sidenav-ol--ep').should('contain', 'Add test_progress');
    cy.get('.sidenav-ol--ep').should('contain', 'Add test_progress_2');
    cy.get('.sidenav-ol--ep a')
      .contains('Add test_progress')
      .click({ force: true });

    cy.url().should('include', '#fieldset-default-field-label-test_progress');

    cy.request({
      method: 'PATCH',
      url: `${Cypress.env('API_PATH') || 'http://localhost:8080/Plone'}/cypress/my-page/test-progress`,
      headers: {
        Accept: 'application/json',
      },
      auth: {
        user: 'admin',
        pass: 'admin',
      },
      body: {
        test_progress: 'test',
        test_progress_2: 'test',
      },
    });

    cy.visit('/cypress/my-page/test-progress');

    cy.visit('/controlpanel/progress.editing');
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
