/* eslint-disable no-unused-expressions */
describe('Editing progress', () => {
  before(() => {
    cy.autologin();
    cy.addContentType('music');
    cy.visit('/controlpanel/dexterity-types/music/schema');
    cy.waitForResourceToLoad('@navigation');
    cy.waitForResourceToLoad('@breadcrumbs');
    cy.waitForResourceToLoad('@actions');
    cy.waitForResourceToLoad('@types');
    cy.waitForResourceToLoad('music');
    cy.get('#addfield').click();
    cy.waitForResourceToLoad('Fields');
    cy.get('.react-select__value-container').click({ force: true });
    cy.wait(100);
    cy.get('#react-select-4-option-17').click({ force: true });
    cy.wait(100);
    cy.get('#field-title:enabled').type('Name', { force: true });
    cy.wait(100);
    cy.get(".actions [aria-label='Save']").click();
    cy.wait(100);
    cy.get('#toolbar-save').click();
    cy.waitForResourceToLoad('music');

    cy.createContent({
      contentType: 'music',
      contentId: 'all-of-me',
      contentTitle: 'All of me',
    });
    cy.visit('/all-of-me');
    cy.waitForResourceToLoad('@navigation');
    cy.waitForResourceToLoad('@breadcrumbs');
    cy.waitForResourceToLoad('@actions');
    cy.waitForResourceToLoad('@types');
    cy.waitForResourceToLoad('all-of-me');
    cy.navigate('/all-of-me');
  });
  beforeEach(() => {
    cy.autologin();
    cy.navigate('/controlpanel/progress.editing');
    cy.waitForResourceToLoad('@navigation');
    cy.waitForResourceToLoad('@breadcrumbs');
    cy.waitForResourceToLoad('@actions');
    cy.waitForResourceToLoad('@types');
    cy.waitForResourceToLoad('progress.editing');
  });
  after(() => {
    cy.autologin();
    cy.removeContent('all-of-me');
    cy.removeContentType('music');
  });
  it('should have background color', () => {
    cy.get('#sidebar_Collection').click({ force: true });
    cy.get('#sidebar_Collection').should(
      'have.css',
      'background-color',
      'rgb(173, 216, 230)',
    );
  });
  it('should change background color', () => {
    cy.get('#sidebar_music').click({ force: true });
    cy.waitForResourceToLoad('music');
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
  it('should turn pink', () => {
    cy.get('#sidebar_music').click({ force: true });
    cy.wait(100);
    cy.get('#property_name').click({ force: true });
    cy.wait(100);
    cy.get("#property_content_name [role='combobox']").click({ force: true });
    cy.wait(100);
    cy.get("#property_content_name [role='combobox'] [role='listbox']")
      .contains('Private')
      .click({ force: true });
    cy.wait(100);

    cy.get('#sidebar_Collection').click({ force: true });
    cy.wait(100);
    cy.get('#sidebar_music').should(
      'have.css',
      'background-color',
      'rgb(255, 182, 193)',
    );
  });
  it('deletes and adds fields', () => {
    cy.get('#sidebar_music').click({ force: true });
    cy.wait(100);
    cy.get('#property_name').click({ force: true });
    cy.wait(100);

    cy.get("#property_content_name [role='combobox'] .delete").click({
      force: true,
    });
    cy.wait(100);
    cy.get("#property_content_name [role='combobox']")
      .find('a')
      .should('not.exist');
    cy.get('#sidebar_Collection').click({ force: true });
    cy.wait(100);
    cy.get('#sidebar_music').should(
      'have.css',
      'background-color',
      'rgba(0, 0, 0, 0)',
    );
  });
  it('should add to json', () => {
    const json = {
      prefix: 'name',
      states: ['private'],
      condition: 'python:value',
      hideReady: 'False',
      iconEmpty: 'eea-icon eea-icon-edit',
      iconReady: 'eea-icon eea-icon-check',
      labelEmpty: 'Please set the {label} of this {context.portal_type}',
      labelReady: 'You added the {label}',
      link: 'edit#fieldset-supporting information-field-label-data_description',
      linkLabel: 'Add {label}',
      message: '',
    };
    cy.wait(100);
    cy.get('#sidebar_music').click({ force: true });
    cy.wait(100);
    cy.get('#property_name').click({ force: true });
    cy.wait(100);

    cy.get("#property_content_name [role='combobox']").click({ force: true });
    cy.wait(100);

    cy.get("#property_content_name [role='combobox'] [role='listbox']")
      .contains('Private')
      .click({ force: true });
    cy.wait(100);
    cy.get('#json_button').click();
    cy.wait(100);
    cy.get('.modal textarea')
      .invoke('text')
      .then((text) => {
        expect(JSON.stringify(JSON.parse(text)).includes(JSON.stringify(json)))
          .to.be.true;
      });
    cy.get(".modal [aria-label='Cancel']").click();
    cy.get("#property_content_name [role='combobox'] .delete").click({
      force: true,
    });
  });
  it('should modify json in correct way', () => {
    const json = {
      prefix: 'name',
      states: ['private', 'pending'],
      condition: 'python:value',
      hideReady: 'False',
      iconEmpty: 'eea-icon eea-icon-edit',
      iconReady: 'eea-icon eea-icon-check',
      labelEmpty: 'Please set the {label} of this {context.portal_type}',
      labelReady: 'You added the {label}',
      link: 'edit#fieldset-supporting information-field-label-data_description',
      linkLabel: 'Add {label}',
      message: '',
    };

    cy.wait(100);
    cy.get('#sidebar_music').click({ force: true });
    cy.wait(100);
    cy.get('#property_name').click({ force: true });
    cy.wait(100);

    cy.get("#property_content_name  [role='combobox']").click({ force: true });
    cy.wait(100);
    cy.get("#property_content_name  [role='combobox'] [role='listbox']")
      .contains('Private')
      .click({ force: true });
    cy.get("#property_content_name  [role='combobox'] [role='listbox']")
      .contains('Pending')
      .click({ force: true });
    cy.wait(100);
    cy.get('#property_description').click({ force: true });
    cy.wait(100);

    cy.get("#property_content_description [role='combobox']").click({
      force: true,
    });
    cy.wait(100);
    cy.get("#property_content_description [role='combobox'] [role='listbox']")
      .contains('Private')
      .click({ force: true });
    cy.wait(100);
    cy.get('#json_button').click();
    cy.wait(100);
    cy.get('.modal textarea')
      .eq(0)
      .invoke('text')
      .then((text) => {
        // eslint-disable-next-line no-unused-expressions
        expect(JSON.stringify(JSON.parse(text)).includes(JSON.stringify(json)))
          .to.be.true;
      });
    cy.get(".modal [aria-label='Cancel']").click();
    cy.get('#property_name').click({ force: true });
    cy.wait(100);
    cy.get("#property_content_name [role='combobox'] .delete").click({
      force: true,
      multiple: true,
    });
    cy.wait(100);
    cy.get('#json_button').click();
    cy.wait(100);
    cy.get('.modal textarea')
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(JSON.parse(text)['music'] != null).to.be.true;
      });
    cy.get(".modal [aria-label='Cancel']").click();
    cy.get('#property_description').click({ force: true });
    cy.wait(100);
    cy.get("#property_content_description [role='combobox'] .delete").click({
      force: true,
      multiple: true,
    });
    cy.wait(100);
    cy.get('#json_button').click();
    cy.wait(100);
    cy.get('.modal textarea')
      .eq(0)
      .invoke('text')
      .then((text) => {
        expect(JSON.parse(text)['music'] == null).to.be.true;
      });
  });
});
