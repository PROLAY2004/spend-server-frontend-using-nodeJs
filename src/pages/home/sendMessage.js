import configaruration from '../../config/config.js';
import Api from '../../api/Api.js';

const api = new Api();

export default async function sendResponse(toast, contactDetails) {
	try {
		const response = await api.postApi(
			`${configaruration.BASE_URL}/user/contact`,
			null,
			contactDetails,
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
