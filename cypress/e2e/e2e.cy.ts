/**
 * Feature: Visit a profile
 *
 * Scenario: Visit a profile of a user with a public profile
 *  Given a user with the username "kayladelk04" exists
 *  And the user has a public profile
 *  When I visit the profile page of "kayladelk04"
 *  Then I should see the profile information of "kayladelk04"
 *  And there should be a follow button displayed
 *
 * Scenario: Visit a profile of a user with a private profile
 *  Given a user with the username "colt" exists
 *  And the user has a private profile
 *  When I visit the profile page of "colt"
 *  Then I should see a message that the profile is private
 *  And there should be a follow request button displayed
 */

describe('Visit a profile', () => {
  it('should visit a profile of a user with a public profile', () => {
    cy.visit('http://localhost:3000/login');
    cy.get('input[name="username"]').type('testing');
    cy.get('input[name="password"]').type('password');
    cy.get('button[aria-label="Sign In"]').click();
    cy.origin('https://accounts.spotify.com', () => {
      cy.get('input#login-username').type(Cypress.env('SPOTIFY_EMAIL'));
      cy.get('input#login-password').type(Cypress.env('SPOTIFY_PASSWORD'));
      cy.get('button#login-button').click();
    });
    cy.visit('http://localhost:3000/profile/kayladelk04');
    cy.intercept('http://localhost:8000/api/user/kayladelk04').as(
      'getUserProfile'
    );
    cy.wait('@getUserProfile');
    cy.contains('Kayla Delk').should('exist');
    cy.contains('Follow').should('exist');
  });

  // it('should visit a profile of a user with a private profile', () => {
  //   cy.visit('http://localhost:3000/login');
  //   cy.get('input[name="username"]').type('testing');
  //   cy.get('input[name="password"]').type('password');
  //   cy.visit('http://localhost:3000/profile/colt');
  //   cy.intercept('GET', '/api/user/colt').as('getProfile');
  //   cy.wait('@getProfile');
  //   cy.contains('Colter Purcell').should('exist');
  //   cy.contains('This profile is private').should('exist');
  //   cy.contains('Request to follow').should('exist');
  // });
});
