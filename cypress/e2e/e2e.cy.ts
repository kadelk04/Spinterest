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
