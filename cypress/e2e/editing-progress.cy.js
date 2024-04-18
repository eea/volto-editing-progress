/* eslint-disable no-unused-expressions */
describe('Editing progress', () => {
  before(() => {
    cy.autologin();
    cy.addContentType('music');
    cy.visit('/controlpanel/dexterity-types/music/schema');

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
  });
  beforeEach(() => {
    cy.autologin();
    cy.visit('/controlpanel/progress.editing');
  });
  after(() => {
    cy.autologin();
    cy.removeContent('all-of-me');
    cy.removeContentType('music');
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
    cy.get('span').contains('description').click({ force: true });
    cy.get('.title-editing-progress').first().click({ force: true });
    cy.get('label').contains('Message').click({ force: true });

    cy.get('#sidebar_music').click({ force: true });
    cy.wait(100);
    cy.get('.cancel.mini.icon').click();
  });

  it('should open  json modal', () => {
    cy.get('#json_button').click();
    cy.get('#field-json');
  });
});
