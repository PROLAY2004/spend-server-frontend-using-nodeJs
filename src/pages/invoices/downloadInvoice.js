import { toast } from 'react-toastify';

import configaruration from '../../config/config.js';
import Api from '../../api/Api.js';

const api = new Api();

export default async function downloadInvoice(invoiceId) {
	try {
		const response = await api.getApi(
			`${configaruration.BASE_URL}/user/download-invoice/${invoiceId}`,
			null,
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
