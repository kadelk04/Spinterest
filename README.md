# CSC308_TeamProject
# Our UI prototyping and Storyboard - https://www.figma.com/proto/6Yr6ubKyFAb1ObzJnsepeX/User-Stories?node-id=0-1&t=8cqF0K2bUxwtsZHu-1

## Spotify Client Secret and Client ID
- To run the project, you need to get the client secret and client ID from Spotify (either create a new app at https://developer.spotify.com/dashboard/applications or ask @colter for the client secret and client ID)
- Once you have the client secret and client ID, create a file called `.env.local` in the frontend directory and add the following lines:
```
REACT_APP_CLIENT_ID=<your_client_id>
REACT_APP_CLIENT_SECRET=<the_client_secret>
```
- Note: it is important that the file is called `.env.local` and not `.env` because the client secret and client ID should not be shared on GitHub 👍
