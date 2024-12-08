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

-------------------------|---------|----------|---------|---------|-------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files | 92.06 | 94.01 | 90.62 | 92.06 |
src | 0 | 0 | 0 | 0 |
backend.ts | 0 | 0 | 0 | 0 | 1-38
src/controllers | 100 | 95.5 | 100 | 100 |
UserController.ts | 100 | 100 | 100 | 100 |
favoritesController.ts | 100 | 100 | 100 | 100 |
playlistController.ts | 100 | 100 | 100 | 100 |
spotifyController.ts | 100 | 88.23 | 100 | 100 | 54,189,213-214
src/middleware | 96.15 | 92.3 | 100 | 96.15 |
auth.ts | 96.15 | 92.3 | 100 | 96.15 | 44-47,56
src/models | 100 | 100 | 100 | 100 |
Favorites.ts | 100 | 100 | 100 | 100 |
Playlist.ts | 100 | 100 | 100 | 100 |
User.ts | 100 | 100 | 100 | 100 |
src/routes | 100 | 100 | 100 | 100 |
index.ts | 100 | 100 | 100 | 100 |
src/routes/api | 98.87 | 100 | 100 | 98.87 |
loginRoutes.ts | 90 | 100 | 100 | 90 | 7
playlistRoutes.ts | 100 | 100 | 100 | 100 |
spotifyRoutes.ts | 100 | 100 | 100 | 100 |
userRoutes.ts | 100 | 100 | 100 | 100 |
src/utils | 33.33 | 100 | 0 | 33.33 |
connection.ts | 33.33 | 100 | 0 | 33.33 | 14-38,41-45
-------------------------|---------|----------|---------|---------|-------------------
@ 8 Dec 2024 15:12:00 PST
