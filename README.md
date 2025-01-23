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

-------------------------|---------|----------|---------|---------|---------------------------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|---------------------------------------
All files | 85.91 | 89.65 | 86.36 | 85.91 |
src | 0 | 0 | 0 | 0 |
backend.ts | 0 | 0 | 0 | 0 | 1-42
src/controllers | 89.31 | 90.34 | 100 | 89.31 |
UserController.ts | 94.77 | 92.18 | 100 | 94.77 | 38-42,144-145,180-183,274-275,278-279
favoritesController.ts | 100 | 100 | 100 | 100 |
playlistController.ts | 100 | 100 | 100 | 100 |
profileController.ts | 48.68 | 61.53 | 100 | 48.68 | 35-108,110-111,116-117
spotifyController.ts | 100 | 87.09 | 100 | 100 | 37,172,196-197
src/middleware | 96.15 | 92.3 | 100 | 96.15 |
auth.ts | 96.15 | 92.3 | 100 | 96.15 | 44-47,56
src/models | 97.8 | 100 | 0 | 97.8 |
Favorites.ts | 100 | 100 | 100 | 100 |
Playlist.ts | 100 | 100 | 100 | 100 |
User.ts | 96.55 | 100 | 0 | 96.55 | 42,53
src/routes | 100 | 100 | 100 | 100 |
index.ts | 100 | 100 | 100 | 100 |
src/routes/api | 99.03 | 100 | 100 | 99.03 |
loginRoutes.ts | 90 | 100 | 100 | 90 | 7
playlistRoutes.ts | 100 | 100 | 100 | 100 |
spotifyRoutes.ts | 100 | 100 | 100 | 100 |
userRoutes.ts | 100 | 100 | 100 | 100 |
src/routes/app | 0 | 0 | 0 | 0 |
profileRoute.ts | 0 | 0 | 0 | 0 | 1-12
src/utils | 33.33 | 100 | 0 | 33.33 |
connection.ts | 33.33 | 100 | 0 | 33.33 | 14-38,41-45
-------------------------|---------|----------|---------|---------|---------------------------------------
@ 16 Jan 2025 19:19 PST
