import React, { createContext, useState, useEffect } from 'react';
import ProductsAPI from './api/ProductsAPI';
import axios from 'axios';

export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
	const [token, setToken] = useState(false);

	const refreshToken = async () => {
		const res = await axios.get('/user/refresh_token');

		// console.log(res);
		setToken(res.data.accesstoken);
	};

	useEffect(() => {
		const firstLogin = localStorage.getItem('firstlogin');
		if (firstLogin) refreshToken();
	}, []);

	const state = {
		token: [token, setToken],
		productsAPI: ProductsAPI()
	};
	ProductsAPI();
	return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
