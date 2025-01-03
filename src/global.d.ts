export {};

declare namespace Spotify {
	interface Player {
		new (options: PlayerOptions): Player;

		connect(): Promise<boolean>;
		disconnect(): void;

		// Additional methods and properties as needed
	}

	interface PlayerOptions {
		name: string;
		getOAuthToken: (callback: (token: string) => void) => void;
		volume?: number;
	}
}
