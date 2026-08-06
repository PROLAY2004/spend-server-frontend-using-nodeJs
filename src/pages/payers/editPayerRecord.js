import apiInterceptor from '../../api/interceptor.js';

export default async function updateRecord(navigate, toast, recordId, formData) {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'PUT',
			`/user/dashboard/records/${recordId}`,
			formData,
		);
		const result = await response.json();

		if (result.success) {
			toast.success(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});

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
