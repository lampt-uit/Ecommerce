//Get product has been in cart  => display

import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import axios from 'axios';
import PaypalButton from './PaypalButton';

const Cart = () => {
	const state = useContext(GlobalState);
	const [cart, setCart] = state.userAPI.cart;
	const [total, setTotal] = useState(0);
	// const [callback, setCallback] = state.userAPI.callback;
	const [token] = state.token;

	useEffect(() => {
		const getTotal = () => {
			const total = cart.reduce((prev, item) => {
				return prev + item.price * item.quantity;
			}, 0);
			setTotal(total);
		};
		getTotal();
	}, [cart]);
	const addToCart = async (cart) => {
		await axios.patch(
			'/user/addcart',
			{ cart },
			{
				headers: { Authorization: token }
			}
		);
	};

	const increase = (id) => {
		cart.forEach((item) => {
			if (item._id === id) {
				item.quantity += 1;
			}
		});
		//New cart
		setCart([...cart]);
		addToCart(cart);
	};

	const decrease = (id) => {
		cart.forEach((item) => {
			if (item._id === id) {
				item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
			}
		});
		//New cart
		setCart([...cart]);
		addToCart(cart);
	};

	const removeProduct = (id) => {
		if (window.confirm('Do you to delete this product ?')) {
			cart.forEach((item, index) => {
				if (item._id === id) {
					cart.splice(index, 1);
				}
			});

			setCart([...cart]);
			addToCart(cart);
		}
	};

	const tranSuccess = async (payment) => {
		// console.log(payment);
		const { paymentID, address } = payment;
		await axios.post(
			'/api/payment',
			{
				cart,
				paymentID,
				address
			},
			{
				headers: { Authorization: token }
			}
		);
		setCart([]);
		addToCart([]);
		alert('You have successfully placed an order');
		// setCallback(!callback);
	};

	if (cart.length === 0)
		return (
			<h2 style={{ textAlign: 'center', fontSize: '5rem' }}>CART EMPTY</h2>
		);

	return (
		<div>
			{cart.map((product) => (
				<div className='detail cart' key={product._id}>
					<img src={product.images.url} alt='#'></img>
					<div className='box-detail'>
						<h2>{product.title}</h2>
						<h3>$ {product.price * product.quantity}</h3>
						<p>{product.description}</p>
						<p>{product.content}</p>

						<div className='amount'>
							<button onClick={() => decrease(product._id)}>-</button>
							<span>{product.quantity}</span>
							<button onClick={() => increase(product._id)}>+</button>
						</div>

						<div className='delete' onClick={() => removeProduct(product._id)}>
							X
						</div>
					</div>
				</div>
			))}

			<div className='total'>
				<h3>Total: $ {total}</h3>
				<PaypalButton total={total} tranSuccess={tranSuccess} />
			</div>
		</div>
	);
};

export default Cart;
