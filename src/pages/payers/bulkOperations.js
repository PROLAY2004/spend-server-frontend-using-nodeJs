import apiInterceptor from '../../api/interceptor.js';

const handleBulkAction = async (navigate, toast, actionData) => {
	try {
		const response = await apiInterceptor(
			navigate,
			toast,
			'POST',
			'/user/dashboard/bulk-action',
			actionData,
		);
		const result = await response.json();

		if (result.success) {
			toast.success(result.message, { theme: 'dark' });
			return true;
		} else {
			toast.error(result.message, { theme: 'dark' });
			return false;
		}
	} catch (err) {
		toast.error(err.message, { theme: 'dark' });
		return false;
	}
};

export default handleBulkAction;
