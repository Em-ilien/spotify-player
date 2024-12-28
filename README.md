# Spotify Player

A simple Spotify client that allows you to play music from Spotify. Needs a Spotify Premium account to work.

## Installation

0. Subscribe to Spotify Premium if you haven't already.
1. Create a Spotify Developer account and create a new app to get the client ID and secret.
2. Clone the repository with `git clone https://github.com/Em-ilien/spotify-player.git`
3. Run `npm install`
4. Create an `.env.local` file in the root of the project and add the following:

```
SPOTIFY_CLIENT_ID=<your_spotify_client_id> # You can get these from the Spotify Developer Dashboard
SPOTIFY_CLIENT_SECRET=<your_spotify_client_secret> # Same as above
SPOTIFY_REDIRECT_URI=http://localhost:5173/callback # or any other port
```

5. Run `npm run dev -- -p 5173 --open` to start the development server

## Author

👤 **Emilien Cosson** <emilien@em-ilien.fr>

## License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Show your support

- Give a ⭐️ if you like this project!

## Issues

If you encounter any issues, please let me know by filing an issue on the GitHub repository.

## Security Vulnerabilities

If you discover a security vulnerability within this project, please send an e-mail to Emilien Cosson at security@em-ilien.fr.
