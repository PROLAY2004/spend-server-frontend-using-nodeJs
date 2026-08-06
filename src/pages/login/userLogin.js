import configaruration from '../../config/config.js';
import Api from '../../api/Api.js';

const api = new Api();

export default async function login(toast, loginData) {
	try {
		const response = await api.postApi(
			`${configaruration.BASE_URL}/user/auth/login`,
			null,
			loginData,
		);
		const result = await response.json();

		if (result.success) {
			toast.success(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

			localStorage.setItem('access_token', result.data.access_token);
			localStorage.setItem('refresh_token', result.data.refresh_token);

			return true;
		} else {
			toast.error(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

			return false;
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});

		return false;
	}
}
