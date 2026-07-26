import apiInterceptor from '../../api/interceptor.js';

export default async function getInvoiceDetails(navigate, toast, payload) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			`/user/dashboard/view-invoice`,
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
