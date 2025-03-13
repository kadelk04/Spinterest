# CSC308_TeamProject

Our UI prototyping and Storyboard - https://www.figma.com/proto/6Yr6ubKyFAb1ObzJnsepeX/User-Stories?node-id=0-1&t=8cqF0K2bUxwtsZHu-1

## Spotify Client Secret and Client ID

- To run the project, you need to get the client secret and client ID from Spotify (either create a new app at https://developer.spotify.com/dashboard/applications or ask @colter for the client secret and client ID)
- Once you have the client secret and client ID, create a file called `.env.local` in the frontend directory and add the following lines:

```
REACT_APP_CLIENT_ID=<your_client_id>
REACT_APP_CLIENT_SECRET=<the_client_secret>
```

- Note: it is important that the file is called `.env.local` and not `.env` because the client secret and client ID should not be shared on GitHub 👍

## Instructions for running Cypress Tests

1. Copy the `.cypress.config.ts` file from the root directory and paste it into the root directory
2. Rename the file to `cypress.config.ts`
3. Add your spotify login information to the `cypress.config.ts` in the provided fields
4. Run `npm run cy:open` to open the cypress test runner
5. Click on the test you want to run
   > Note: The login tests ARE flaky due to Spotify's recaptcha. If the test fails, it will be because the Spotify login page is trying to change the behavior to prevent bots from logging in.

## Linting and Code Style

1. Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. Run `npm i` in the root directory of the repo to install the husky hook functionality

- Now, when you run either `npm run format` or `git commit <anything>` Prettier will run on all the code in the repo.

### General Style Rules

**Prettier Configuration**

- `semi`: true
  - Ensures that semicolons are added at the end of statements.
- `trailingComma`: "es5"
  - Adds trailing commas where valid in ES5 (objects, arrays, etc.). This helps with cleaner diffs in version control.
- `singleQuote`: true
  - Enforces the use of single quotes for strings instead of double quotes.
- `printWidth`: 80
  - Sets the maximum line length to 80 characters. This helps for smaller windows/screens.
- `tabWidth`: 2
  - Sets the number of spaces per indentation level to 2.
- `useTabs`: false
  - Uses spaces for indentation instead of tabs.
- `jsxSingleQuote`: false
  - Uses double quotes in JSX attributes instead of single quotes.
- `arrowParens`: "always"
  - Always includes parentheses around arrow function parameters.
- `endOfLine`: "lf"
  - Enforces the use of Unix-style line endings (\n). This is important for cross-platform compatibility. Consistency across Mac and Windows is important for our team.

### ESLint Rules

- No custom rules enforced.

## Coverage

----------------------------|---------|----------|---------|---------|---------------------------------------------------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------|---------|----------|---------|---------|---------------------------------------------------------------------
All files | 81.62 | 89.74 | 79.36 | 81.62 |
src | 0 | 0 | 0 | 0 |
backend.ts | 0 | 0 | 0 | 0 | 1-35
src/controllers | 79.8 | 89.8 | 86.79 | 79.8 |
UserController.ts | 75.27 | 91.37 | 76.47 | 75.27 | 36-48,61-65,160-189,198-217,227-228,263-266,341-342,345-346,356-368
artistController.ts | 91.66 | 90.9 | 100 | 91.66 | 94-98,100-103
favoritesController.ts | 100 | 100 | 100 | 100 |
notificationController.ts | 95.62 | 90.69 | 100 | 95.62 | 114-116,150-152,180-182,234-236
playlistController.ts | 86.87 | 96 | 85.71 | 86.87 | 38-39,142-160
profileController.ts | 35.22 | 61.53 | 50 | 35.22 | 33-106,108-109,114-115,159-213,221-247
spotifyController.ts | 100 | 87.09 | 100 | 100 | 34,163,183-184
src/middleware | 96.06 | 92.3 | 100 | 96.06 |
auth.ts | 96.06 | 92.3 | 100 | 96.06 | 41-44,53
src/models | 98.19 | 100 | 0 | 98.19 |
Artist.ts | 100 | 100 | 100 | 100 |
Favorites.ts | 100 | 100 | 100 | 100 |
Notification.ts | 98.24 | 100 | 0 | 98.24 | 44
Playlist.ts | 100 | 100 | 100 | 100 |
User.ts | 96.66 | 100 | 0 | 96.66 | 44,55
src/routes | 100 | 100 | 100 | 100 |
index.ts | 100 | 100 | 100 | 100 |
src/routes/api | 96.7 | 100 | 100 | 96.7 |
artistRoutes.ts | 84.37 | 100 | 100 | 84.37 | 13,17,21,25,29
loginRoutes.ts | 90 | 100 | 100 | 90 | 7
notificationRoutes.ts | 100 | 100 | 100 | 100 |
playlistRoutes.ts | 100 | 100 | 100 | 100 |
profileRoute.ts | 100 | 100 | 100 | 100 |
spotifyRoutes.ts | 100 | 100 | 100 | 100 |
userRoutes.ts | 100 | 100 | 100 | 100 |
src/utils | 34.69 | 100 | 0 | 34.69 |
connection.ts | 34.69 | 100 | 0 | 34.69 | 16-42,45-49
----------------------------|---------|----------|---------|---------|---------------------------------------------------------------------
@ 13 Mar 2025 23:37 PST
