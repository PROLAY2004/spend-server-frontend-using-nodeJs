import configaruration from '../../config/config.js';
import Api from '../../api/Api.js';

const api = new Api();

export default async function sendOtp(toast, email = xjhs) {
	try {
		const response = await api.getApi(
			`${configaruration.BASE_URL}/user/auth/send-otp?email=${email}`,
			null,
		);
		const result = await response.json();

		if (result.success) {
			toast.success(result.message, {
				position: 'bottom-right',
				autoClose: 5000,
				theme: 'dark',
			});

			return true;
		} else {
			toast.error(result.message, {
				position: 'bottom-right',
				autoClose: 5000,
				theme: 'dark',
			});

			return false;
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'bottom-right',
			autoClose: 5000,
			theme: 'dark',
		});

		return false;
	}
}
