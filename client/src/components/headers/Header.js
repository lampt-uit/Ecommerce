import React, { useContext, useState } from 'react';
import { GlobalState } from '../../GlobalState';
import Menu from './Icon/menu.svg';
import Cart from './Icon/cart.svg';
import Close from './Icon/close.svg';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
	//Get State from useContext (DataProvider)
	const state = useContext(GlobalState);
	// console.log(state);

	const [isLogged] = state.userAPI.isLogged;
	const [isAdmin] = state.userAPI.isAdmin;
	const [cart] = state.userAPI.cart;
	const [menu, setMenu] = useState(false);

	const logoutUser = async () => {
		await axios.get('/user/logout');
		localStorage.removeItem('firstLogin');
		// setIsAdmin(false);
		// setIsLogged(false);
		window.location.href = '/';
	};

	const adminRouter = () => {
		return (
			<>
				<li>
					<Link to='/create_product'>Create Product</Link>
				</li>
				<li>
					<Link to='/category'>Categoris</Link>
				</li>
			</>
		);
	};

	const loggedRouter = () => {
		return (
			<>
				<li>
					<Link to='/history'>History</Link>
				</li>
				<li>
					<Link to='/' onClick={logoutUser}>
						Logout
					</Link>
				</li>
			</>
		);
	};
	const styleMenu = {
		left: menu ? 0 : '-100%'
	};
	return (
		<header>
			<div className='menu' onClick={() => setMenu(!menu)}>
				<img src={Menu} width='30' alt='bars' />
			</div>
			<div className='logo'>
				<h1>
					<Link to='/'>{isAdmin ? 'Admin' : 'LS SHOP'}</Link>
				</h1>
			</div>

			<ul style={styleMenu}>
				<li>
					<Link to='/'>{isAdmin ? 'Products' : 'LS SHOP'}</Link>
				</li>
				{isAdmin && adminRouter()}{' '}
				{isLogged ? (
					loggedRouter()
				) : (
					<li>
						<Link to='/login'>Login ✥ Register</Link>
					</li>
				)}
				<li onClick={() => setMenu(!menu)}>
					<img src={Close} alt='#' width='30' className='menu' />
				</li>
			</ul>

			{isAdmin ? (
				''
			) : (
				<div className='cart-icon'>
					{/* Display number product has been in cart */}
					<span>{cart.length}</span>
					<Link to='/cart'>
						<img src={Cart} alt='cart' width='30' />
					</Link>
				</div>
			)}
		</header>
	);
};

export default Header;
