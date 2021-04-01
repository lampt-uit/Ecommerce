import React, { useContext } from 'react';
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

	const logoutUser = async () => {
		await axios.get('/user/logout');
		localStorage.clear();
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
	return (
		<header>
			<div className='menu'>
				<img src={Menu} width='30' atl='#'></img>
			</div>
			<div className='logo'>
				<h1>
					<Link to='/'>{isAdmin ? 'Admin' : 'LS SHOP'}</Link>
				</h1>
			</div>

			<ul>
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
				<li>
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
						<img src={Cart} atl='' width='30'></img>
					</Link>
				</div>
			)}
		</header>
	);
};

export default Header;
