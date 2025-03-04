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
----------------------------|---------|----------|---------|---------|---------------------------------------------------------------
All files | 82.37 | 90.33 | 80.64 | 82.37 |
src | 0 | 0 | 0 | 0 |
backend.ts | 0 | 0 | 0 | 0 | 1-35
src/controllers | 80.81 | 90.47 | 88.46 | 80.81 |
UserController.ts | 77.43 | 92.18 | 81.25 | 77.43 | 40-44,139-168,177-199,209-210,245-248,331-332,335-336,347-359
artistController.ts | 91.66 | 90.9 | 100 | 91.66 | 94-98,100-103
favoritesController.ts | 100 | 100 | 100 | 100 |
notificationController.ts | 96.02 | 90.69 | 100 | 96.02 | 121-123,163-165,201-203,261-263
playlistController.ts | 87.5 | 100 | 85.71 | 87.5 | 134-152
profileController.ts | 35.22 | 61.53 | 50 | 35.22 | 33-106,108-109,114-115,159-213,221-247
spotifyController.ts | 100 | 87.09 | 100 | 100 | 37,166,186-187
src/middleware | 96.06 | 92.3 | 100 | 96.06 |
auth.ts | 96.06 | 92.3 | 100 | 96.06 | 41-44,53
src/models | 98.25 | 100 | 0 | 98.25 |
Artist.ts | 100 | 100 | 100 | 100 |
Favorites.ts | 100 | 100 | 100 | 100 |
Notification.ts | 98.43 | 100 | 0 | 98.43 | 51
Playlist.ts | 100 | 100 | 100 | 100 |
User.ts | 96.66 | 100 | 0 | 96.66 | 44,55
src/routes | 100 | 100 | 100 | 100 |
index.ts | 100 | 100 | 100 | 100 |
src/routes/api | 96.68 | 100 | 100 | 96.68 |
artistRoutes.ts | 84.37 | 100 | 100 | 84.37 | 13,17,21,25,29
loginRoutes.ts | 90 | 100 | 100 | 90 | 7
notificationRoutes.ts | 100 | 100 | 100 | 100 |
playlistRoutes.ts | 100 | 100 | 100 | 100 |
profileRoute.ts | 100 | 100 | 100 | 100 |
spotifyRoutes.ts | 100 | 100 | 100 | 100 |
userRoutes.ts | 100 | 100 | 100 | 100 |
src/utils | 34.69 | 100 | 0 | 34.69 |
connection.ts | 34.69 | 100 | 0 | 34.69 | 16-42,45-49
----------------------------|---------|----------|---------|---------|---------------------------------------------------------------
@ 4 Mar 2025 15:10 PST
