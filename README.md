# Simplayer Spotify - web app Spotify player

The dumbest Spotify player web client ever that lets you play music from Spotify without any lag.

Needs a Spotify Premium account to work.

## Installation

### Prerequisites

- Subscribe to Spotify Premium if you haven't already.
- Create a Spotify Developer account and create a new app to get the client ID and secret.

### Setup

```sh
git clone https://github.com/Em-ilien/Simplayer-Spotify-web.git
cd spotify-player
npm install
```

Then, create a `.env.local` file at the root of the project and add the following environment variables:

```
# .env.local:
SPOTIFY_CLIENT_ID=<your_client_id> # Replace with your Spotify client ID
SPOTIFY_CLIENT_SECRET=<your_client_secret> # Replace with your Spotify client secret
```

Start the development server:

```sh
npm run dev -- --open
```

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
