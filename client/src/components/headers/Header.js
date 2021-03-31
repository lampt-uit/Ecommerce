import React, { useState, useContext } from 'react';
import { GlobalState } from '../../GlobalState';
import Menu from './Icon/menu.svg';
import Cart from './Icon/cart.svg';
import Close from './Icon/close.svg';
import { Link } from 'react-router-dom';

const Header = () => {
	const value = useContext(GlobalState);
	return (
		<header>
			<div className='menu'>
				<img src={Menu} atl='' width='30'></img>
			</div>
			<div className='logo'>
				<h1>
					<Link to='/'>LS SHOP</Link>
				</h1>
			</div>

			<ul>
				<li>
					<Link to='/'>Products</Link>
				</li>
				<li>
					<Link to='/login'>Login ✥ Register</Link>
				</li>
				<li>
					<img src={Close} alt='' width='30' className='menu' />
				</li>
			</ul>

			<div className='cart-icon'>
				<span>0</span>
				<Link to='/cart'>
					<img src={Cart} atl='' width='30'></img>
				</Link>
			</div>
		</header>
	);
};

export default Header;
