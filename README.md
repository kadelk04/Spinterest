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
