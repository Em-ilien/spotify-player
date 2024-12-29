import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const accessToken = cookies.get('spotify_access_token');

	return {
		accessToken
	};
};
