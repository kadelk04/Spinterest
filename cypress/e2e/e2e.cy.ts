/// <reference types="cypress" />
/* Feature: Sign In/Sign Up as a User
Scenario: New user signs up
  Given a user with no account
  When the user enters the site
  And the user clicks the "Sign Up" button
  And the user enters their username and desired password
  And the user submits the form
  Then the user is redirected to the Spotify OAuth consent screen
  And the user grants access
  Then the user's account is linked to Spotify successfully

Scenario: Existing user returns with an expired OAuth grant from Spotify
  Given a user with an existing username and password account
  When the user enters their username and password
  And clicks "Sign In"
  Then the user is redirected to the Spotify OAuth consent screen
  And the user grants access
  Then the user's account is relinked to Spotify successfully

Scenario: Returning user has an existing valid grant from Spotify
  Given a user with an existing account linked to Spotify
  When the user enters their username and password
  And clicks "Sign In"
  Then the user is redirected to their dashboard

Scenario: Returning user has fully valid login credentials
Given a user with an existing account is linked to Spotify
And has a login token stored in the browser
Then the user is directed immediately to their dashboard */

describe('Sign In/Sign Up as a User', () => {
  const siteUrl = Cypress.env('SITE_URL');
  const apiUrl = Cypress.env('API_URL');
  const username = `newuser${Math.random().toString(36).substring(7)}`;

  it('New user signs up', () => {
    cy.visit(`${siteUrl}`);
    cy.get('p').contains('Sign up').click();
    cy.get('input[name="su-username"]').type(username);
    cy.get('input[name="su-password"]').type('password');
    cy.get('input[name="su-confirm-password"]').type('password');
    cy.get('button').contains('Sign Up').click();

    // Simulate Spotify OAuth flow
    cy.origin('https://accounts.spotify.com', () => {
      const spotifyEmail = Cypress.env('SPOTIFY_EMAIL');
      const spotifyPassword = Cypress.env('SPOTIFY_PASSWORD');
      cy.get('input#login-username').type(spotifyEmail);
      cy.get('input#login-password').type(spotifyPassword);
      cy.get('button').contains('Log In').click();
    });

    cy.url().should('include', `/dashboard`);
  });

  // it('Existing user returns with an expired OAuth grant from Spotify', () => {
  //   cy.visit(`${siteUrl}`);
  //   cy.get('input[name="username"]').type('existinguser');
  //   cy.get('input[name="password"]').type('password');
  //   cy.get('button').contains('Sign In').click();

  //   // Simulate Spotify OAuth flow
  //   cy.origin('https://accounts.spotify.com', () => {
  //     cy.get('input[name="username"]').type(spotifyEmail);
  //     cy.get('input[name="password"]').type(spotifyPassword);
  //     cy.get('button').contains('Agree').click();
  //   });

  //   cy.url().should('include', '/dashboard');
  // });

  // it('Returning user has an existing valid grant from Spotify', () => {
  //   cy.visit(`${siteUrl}`);
  //   cy.get('input[name="username"]').type('existinguser');
  //   cy.get('input[name="password"]').type('password');
  //   cy.get('button').contains('Sign In').click();
  //   cy.url().should('include', '/dashboard');
  // });

  // it('Returning user has fully valid login credentials', () => {
  //   cy.visit(`${siteUrl}`);
  //   cy.url().should('include', '/dashboard');
  // });
});
