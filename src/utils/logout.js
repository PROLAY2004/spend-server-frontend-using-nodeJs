export default function logout(toast) {
	localStorage.clear();

	toast.info('User Logout Successful', {
		position: 'bottom-right',
		autoClose: 5000,
		theme: 'dark',
	});

	return true;
}
