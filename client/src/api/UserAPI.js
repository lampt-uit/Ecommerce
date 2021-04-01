import { useState, useEffect } from 'react';
import axios from 'axios';

const UserAPI = (token) => {
	const [isLogged, setIsLogged] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	const [cart, setCart] = useState([]);
	useEffect(() => {
		if (token) {
			const getUser = async () => {
				try {
					const res = await axios.get('/user/info', {
						headers: { Authorization: token }
					});

					// console.log(res);

					setIsLogged(true);
					res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
					setCart(res.data.cart);
				} catch (error) {
					alert(error.res.data.msg);
				}
			};
			getUser();
		}
	}, [token]);

	const addCart = async (product) => {
		if (!isLogged) return alert('Please Login To Continue buying');

		//Check this product on cart??
		const check = cart.every((item) => {
			return item._id !== product._id;
		});

		if (check) {
			setCart([...cart, { ...product, quantity: 1 }]);

			await axios.patch(
				'/user/addcart',
				{ cart: [...cart, { ...product, quantity: 1 }] },
				{
					headers: { Authorization: token }
				}
			);
		} else {
			alert('This product has been added to cart');
		}
	};

	return {
		isLogged: [isLogged, setIsLogged],
		isAdmin: [isAdmin, setIsAdmin],
		cart: [cart, setCart],
		addCart: addCart
	};
};

export default UserAPI;
