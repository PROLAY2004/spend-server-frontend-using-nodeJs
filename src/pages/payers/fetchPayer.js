import apiInterceptor from '../../api/interceptor.js';

export default async function displayPayer(navigate, toast, payload) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/dashboard/fetch-payers',
			payload,
		);
		const result = await response.json();

		if (result.success) {
			return result.data;
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
