import configaruration from '../../config/config.js';
import { toast } from 'react-toastify';

const fetchPublicInvoiceData = async (
	page = 1,
	setInitialLoading,
	setTableLoading,
	token,
) => {
	try {
		const response = await fetch(`${configaruration.BASE_URL}/user/invoice`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ page, limit: 5 }),
		});

		const result = await response.json();

		if (response.ok && result.success) {
			return result.data;
		} else {
			toast.error(result.message, {
				position: 'top-right',
				autoClose: 5000,
				theme: 'dark',
			});
		}
	} catch (err) {
		toast.error(err.message, {
			position: 'top-right',
			autoClose: 5000,
			theme: 'dark',
		});
	}
};

export default fetchPublicInvoiceData;
