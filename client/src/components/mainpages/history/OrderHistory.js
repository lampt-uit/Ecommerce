import React, { useContext, useEffect } from 'react';
import { GlobalState } from '../../../GlobalState';
import { Link } from 'react-router-dom';
import axios from 'axios';
const OrderHistory = () => {
	const state = useContext(GlobalState);
	const [history, setHistory] = state.userAPI.history;
	const [isAdmin] = state.userAPI.isAdmin;
	const [token] = state.token;

	useEffect(() => {
		if (token) {
			const getHistory = async () => {
				if (isAdmin) {
					//This API get all payments
					const res = await axios.get('/api/payment', {
						headers: { Authorization: token }
					});
					setHistory(res.data);
				} else {
					//This API get payment of user
					const res = await axios.get('/user/history', {
						headers: { Authorization: token }
					});
					setHistory(res.data);
				}
			};
			getHistory();
		}
	}, [token, isAdmin, setHistory]); //if dev [token, callback => no run bc token,callback not change]

	return (
		<div className='history-page'>
			<h2>History</h2>
			<h4>You have {history.length} Ordered</h4>
			<table>
				<thead>
					<tr>
						<th>PaymentId</th>
						<th>Date of Purchase</th>
						<th>*</th>
					</tr>
				</thead>
				<tbody>
					{history.map((items) => (
						<tr key={items._id}>
							<td>{items.paymentID}</td>
							<td>{new Date(items.createdAt).toLocaleDateString()}</td>
							<td>
								<Link to={`/history/${items._id}`}>View</Link>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default OrderHistory;
