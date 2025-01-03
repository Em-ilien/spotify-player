interface Player {
	addListener: (event: string, callback: (data: any) => void) => void;
	connect: () => Promise<boolean>;
	disconnect: () => Promise<void>;
	getCurrentState: () => Promise<any>;
	togglePlay: () => Promise<void>;
	nextTrack: () => Promise<void>;
	previousTrack: () => Promise<void>;
	setVolume: (volume_rate: number) => Promise<void>;
	seek: (position_ms: number) => Promise<void>;
}

export const playerState = $state({
	player: undefined as Player,
	state: {} as any,
	devices: [] as { id: string; name: string }[],
	setPlayer: (p: Player) => {
		playerState.player = p;
		changePlayer();
	},
	togglePlay: async () => {
		await playerState.player.togglePlay();
	},
	nextTrack: async () => {
		await playerState.player.nextTrack();
	},
	previousTrack: async () => {
		await playerState.player.previousTrack();
	},
	setVolume: async (volume_rate: number) => {
		await playerState.player.setVolume(volume_rate);
	},
	seek: async (position_ms: number) => {
		await playerState.player.seek(position_ms);
	},
	disconnect: async () => {
		console.log(playerState.player);

		await playerState.player.disconnect();
	},
	connectToDevice: async (deviceId: string) => {
		const res = await fetch('/api/player', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ device_id: deviceId })
		});

		console.log('Player connected to Spotify', res);

		const s = await playerState.player.getCurrentState();
		playerState.state = s;
		if (!s) {
			console.error('User is not playing music through the Web Playback SDK');
			return;
		}
	}
});

const changePlayer = () => {
	playerState.player.addListener('ready', ({ device_id }: { device_id: string }) => {
		console.log('Ready with Device ID', device_id);
	});
	playerState.player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
		console.log('Device ID has gone offline', device_id);
	});
	playerState.player.addListener('initialization_error', ({ message }: { message: string }) => {
		console.error(message);
	});
	playerState.player.addListener('authentication_error', ({ message }: { message: string }) => {
		console.error(message);
	});
	playerState.player.addListener('account_error', ({ message }: { message: string }) => {
		console.error(message);
	});
	playerState.player.connect().then((success: boolean) => {
		if (success) {
			console.log('The Web Playback SDK successfully connected to Spotify!');
		}
	});
	playerState.player.addListener('player_state_changed', (s) => {
		console.log('Player state changed', s);
		playerState.state = s;
	});
	playerState.player.addListener('autoplay_failed', () => {
		console.log('Autoplay is not allowed by the browser autoplay rules');
	});
	playerState.player.addListener('playback_error', ({ message }: { message: string }) => {
		console.error('Failed to perform playback', message);
	});
};
