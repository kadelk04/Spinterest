# CSC308_TeamProject

Our UI prototyping and Storyboard - https://www.figma.com/proto/6Yr6ubKyFAb1ObzJnsepeX/User-Stories?node-id=0-1&t=8cqF0K2bUxwtsZHu-1

## Spotify Client Secret and Client ID

- To run the project, you need to get the client secret and client ID from Spotify (either create a new app at https://developer.spotify.com/dashboard/applications or ask @colter for the client secret and client ID)
- Once you have the client secret and client ID, create a file called `.env.local` in the frontend directory and add the following lines:

```
REACT_APP_CLIENT_ID=<your_client_id>
REACT_APP_CLIENT_SECRET=<the_client_secret>
```

- Create a file called `.env.local` in the backend directory and add the following lines:

```
PORT=8000
MONGO_DB_PASSWORD=<your_mongo_db_password>
TOKEN_SECRET=<your_jwt_token_secret>
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

## Product Spec

https://docs.google.com/document/d/1G4k80ptgRkWQshGMNhSnUkRGoNpu3IY-UyjHGVjwXWc/edit?usp=sharing

## Coverage

----------------------------|---------|----------|---------|---------|------------------------------------------------------------------------
File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------------|---------|----------|---------|---------|------------------------------------------------------------------------
All files | 86.76 | 89.03 | 85.07 | 86.76 |
src | 0 | 0 | 0 | 0 |
backend.ts | 0 | 0 | 0 | 0 | 1-35
src/controllers | 86.84 | 89 | 92.98 | 86.84 |
UserController.ts | 80.91 | 92.18 | 82.35 | 80.91 | 36-48,61-65,160-189,231-232,267-270,345-346,349-350,360-372
artistController.ts | 91.66 | 90.9 | 100 | 91.66 | 94-98,100-103
favoritesController.ts | 100 | 100 | 100 | 100 |
notificationController.ts | 95.62 | 90.69 | 100 | 95.62 | 114-116,150-152,180-182,234-236
playlistController.ts | 86.87 | 96 | 85.71 | 86.87 | 38-39,142-160
profileController.ts | 73.02 | 77.08 | 100 | 73.02 | 34-107,109-110,115-116,182-183,199-200,211-213,245-247,374-382,384-392
spotifyController.ts | 100 | 87.09 | 100 | 100 | 34,163,183-184
vibesController.ts | 92.02 | 88.57 | 100 | 92.02 | 64-66,99-101,115-121
src/middleware | 96.06 | 92.3 | 100 | 96.06 |
auth.ts | 96.06 | 92.3 | 100 | 96.06 | 41-44,53
src/models | 98.21 | 100 | 0 | 98.21 |
Artist.ts | 100 | 100 | 100 | 100 |
Favorites.ts | 100 | 100 | 100 | 100 |
Notification.ts | 98.24 | 100 | 0 | 98.24 | 44
Playlist.ts | 100 | 100 | 100 | 100 |
User.ts | 96.77 | 100 | 0 | 96.77 | 46,57
src/routes | 100 | 100 | 100 | 100 |
index.ts | 100 | 100 | 100 | 100 |
src/routes/api | 96.92 | 100 | 100 | 96.92 |
artistRoutes.ts | 84.37 | 100 | 100 | 84.37 | 13,17,21,25,29
loginRoutes.ts | 90 | 100 | 100 | 90 | 7
notificationRoutes.ts | 100 | 100 | 100 | 100 |
playlistRoutes.ts | 100 | 100 | 100 | 100 |
profileRoute.ts | 100 | 100 | 100 | 100 |
spotifyRoutes.ts | 100 | 100 | 100 | 100 |
userRoutes.ts | 100 | 100 | 100 | 100 |
vibeRoutes.ts | 100 | 100 | 100 | 100 |
src/utils | 34.69 | 100 | 0 | 34.69 |
connection.ts | 34.69 | 100 | 0 | 34.69 | 16-42,45-49
----------------------------|---------|----------|---------|---------|------------------------------------------------------------------------

@ 14 Mar 2025 15:16 PST
