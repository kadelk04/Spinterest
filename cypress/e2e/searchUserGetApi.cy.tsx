/// <reference types="cypress" />

// Feature: Search other users as a User
// Scenario: User wants to search a specific user via the search bar
// Given the user is logged in with their Spinterest account
// When the initiating user goes on their dashboard and types on the search bar the user they are looking for
// Then the suggested users populate on the search bar, and the initiating user can scroll to find their specific user or keep typing to find that specific user 
// And the initiating user can click on their specific user suggestion, leading them to their profile

// Scenario: User tries to find a user that doesn't exist 
// Given the user is logged in with their Spinterest account
// When the initiating user types a username in the search bar that doesn't exist in the system
// Then after the user has finished typing, the system displays a "No users found" message in the dropdown

// Define an interface for the expected API response
interface User {
  username: string;
  [key: string]: any; // Allows for additional properties
}

describe('GET Search User API', () => {
  // Test: When the search term exists
  it('should return an array of users when a matching username is provided', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8000/api/user/search/gale1'
    }).then((response) => {
      // Verify that the status code is 200
      expect(response.status).to.eq(200);

      // Explicitly type response body
      const users: User[] = response.body;

      // Check that the response body is an array
      expect(users).to.be.an('array');

      // If there are any results, ensure each has a username property
      users.forEach((user: User) => {
        expect(user).to.have.property('username');
      });
    });
  });

  // Test: When no matching user exists
  it('should return an empty array when no matching username is provided', () => {
    cy.request({
      method: 'GET',
      url: 'http://localhost:8000/api/user/search/nonExistingUser123',
      // Prevent Cypress from failing the test on non-2xx status codes if needed
      failOnStatusCode: false
    }).then((response) => {
      // The endpoint should return a 200 even if no users are found,
      // with an empty array as the response body.
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array').and.to.have.length(0);
    });
  });
});
