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
			localStorage.setItem('userName', result.data.user.email.split('@')[0]);
			localStorage.setItem('email', result.data.user.email);

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
