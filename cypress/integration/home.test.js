
describe('home page', () => {


  beforeEach(() => {
    cy.fixture('courses.json').as('coursesJSON');

    cy.server();

    cy.route('/api/courses', '@coursesJSON').as('courses');


    cy.visit('/');

  });

  it('should display a list of courses', () => {

    // get ur demo api call

    cy.contains('All Courses');

    cy.wait('@courses');

    cy.get('mat-card').should('have.length', 9)

  });

  it('should display advanced courses', () => {
    cy.get('.mat-tab-label').should('have.length', 2);
    cy.get('.mat-tab-label').last().click();

    // get its length should be greater than 1
    cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.gt', 1);

    cy.get('.mat-tab-body-active .mat-card-title').first().should('contain', 'Security');

  });
});
