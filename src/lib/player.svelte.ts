export const playerState = $state({
	player: undefined as Spotify.Player | undefined,
	state: {} as any,
	devices: [] as { id: string; name: string; is_this_device: boolean }[],
	setPlayer: (p: Spotify.Player) => {
		playerState.player = p;
		changePlayer(p);
	},
	togglePlay: async () => {
		await playerState.player?.togglePlay();
	},
	nextTrack: async () => {
		await playerState.player?.nextTrack();
	},
	previousTrack: async () => {
		await playerState.player?.previousTrack();
	},
	setVolume: async (volume_rate: number) => {
		await playerState.player?.setVolume(volume_rate);
	},
	seek: async (position_ms: number) => {
		await playerState.player?.seek(position_ms);
	},
	disconnect: async () => {
		console.log(playerState.player);

		await playerState.player?.disconnect();
	},
	activeDevice: async (deviceId: string) => {
		const res = await fetch('/api/player', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ device_id: deviceId })
		});

		const s = await playerState.player!.getCurrentState();
		playerState.state = s;
		if (!s) {
			console.error('User is not playing music through the Web Playback SDK');
			return;
		}
	}
});

const changePlayer = (player: Spotify.Player) => {
	player.addListener('ready', ({ device_id }: { device_id: string }) => {
		console.log('Ready with Device ID', device_id);

		playerState.devices.push({
			name: 'Simplayer Spotify Player',
			id: device_id,
			is_this_device: true
		});
	});
	player?.addListener('not_ready', ({ device_id }: { device_id: string }) => {
		console.log('Device ID has gone offline', device_id);
	});
	player.addListener('initialization_error', ({ message }: { message: string }) => {
		console.error(message);
	});
	player.addListener('authentication_error', ({ message }: { message: string }) => {
		console.error(message);
	});
	player.addListener('account_error', ({ message }: { message: string }) => {
		console.error(message);
	});
	player.connect().then((success: boolean) => {
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
	player.addListener('playback_error', ({ message }: { message: string }) => {
		console.error('Failed to perform playback', message);
	});
};
