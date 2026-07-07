export default function logout(toast) {
	localStorage.clear();

	toast.info('User logout successful', {
		position: 'bottom-right',
		autoClose: 5000,
		theme: 'dark',
	});

	return true;
}
