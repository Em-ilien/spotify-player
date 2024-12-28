import Cookies from 'cookie-universal';

let player: any;

export const playerState = $state({
	state: {} as any,
	setPlayer: (p: any) => {
		player = p;
		changePlayer();
	},
	togglePlay: async () => {
		await player.togglePlay();
	},
	nextTrack: async () => {
		await player.nextTrack();
	},
	previousTrack: async () => {
		await player.previousTrack();
	},
	setVolume: async (volume_rate: number) => {
		await player.setVolume(volume_rate);
	},
	seek: async (position_ms: number) => {
		await player.seek(position_ms);
	}
});

const changePlayer = () => {
	player.addListener('ready', ({ device_id }) => {
		console.log('Ready with Device ID', device_id);

		const cookies = Cookies();
		let accessToken = cookies.get('spotify_access_token');

		fetch('https://api.spotify.com/v1/me/player', {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			method: 'PUT',
			body: JSON.stringify({
				device_ids: [device_id]
			})
		}).then(() => {
			player.getCurrentState().then((s) => {
				playerState.state = s;

				if (!s) {
					console.error('User is not playing music through the Web Playback SDK');
					return;
				}
			});
		});
	});
	player.addListener('not_ready', ({ device_id }) => {
		console.log('Device ID has gone offline', device_id);
	});
	player.addListener('initialization_error', ({ message }) => {
		console.error(message);
	});
	player.addListener('authentication_error', ({ message }) => {
		console.error(message);
	});
	player.addListener('account_error', ({ message }) => {
		console.error(message);
	});
	player.connect().then((success) => {
		if (success) {
			console.log('The Web Playback SDK successfully connected to Spotify!');
		}
	});
	player.addListener('player_state_changed', (s) => {
		console.log('Player state changed', s);
		playerState.state = s;
	});
	player.addListener('autoplay_failed', () => {
		console.log('Autoplay is not allowed by the browser autoplay rules');
	});
	player.on('playback_error', ({ message }) => {
		console.error('Failed to perform playback', message);
	});
	player.on('playback_failed', ({ message }) => {
		console.error('Failed to perform playback', message);
	});
};
