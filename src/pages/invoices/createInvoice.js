import apiInterceptor from '../../api/interceptor.js';

export default async function generateInvoice(navigate, toast, invoiceData) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/dashboard/invoice',
			invoiceData,
		);
		const result = await response.json();

		if (result.success) {
			toast.success(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

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
