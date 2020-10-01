import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { Toolbar, ListItem, IconButton, Card, CardContent, TextField, Select } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import logo from '../../SuperMart.svg';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import * as actionCreators from './../../store/actions/user/action';
import axios from 'axios';
import { connect } from 'react-redux';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
	paper: {
		height: 500,
		width: 500
	},
	paper1: {
		maxWidth: 400,
		margin: `${theme.spacing(1)}px auto`,
		padding: theme.spacing(2)
	},
	control: {
		padding: theme.spacing(2)
	},
	gridList: {
		width: 500,
		height: 450
	}
}));

const Cart = (props) => {
	const [ order, setData ] = useState({
		data: []
	});
	const [ price, setPrice ] = useState();
	const [ count, setCount ] = useState();
	const [ select, setSelect ] = useState();
	const [ address, setAddress ] = useState();
	props.checkAuth();
	useEffect(() => {
		let cart = JSON.parse(localStorage.getItem('cart'));
		setData({
			data: cart
		});
		if (cart) {
			const totalArrCount = cart.map((item) => item.count);
			const totalCount = totalArrCount.reduce((a, b) => a + b, 0);
			setCount(totalCount);
			const totalArr = cart.map((item) => item.count * item.price);
			const total = totalArr.reduce((a, b) => a + b, 0);
			setPrice(total);
		}
	}, []);

	//=======================================================================//
	const paymentHandler = async () => {
		const API_URL = 'http://localhost:5050/user/';
		const datas = {
			price: price
		};
		const response = await axios.post('http://localhost:5050/user/order', datas);
		const { data } = response;
		const options = {
			key: 'rzp_test_pD7pyj5JpXOA5a',
			name: 'Your App Name',
			description: 'Some Description',
			order_id: data.id,
			handler: async (response) => {
				try {
					const data = {
						price: price,
						order: localStorage.getItem('cart'),
						address: address,
						token: localStorage.getItem('uToken')
					};
					const paymentId = response.razorpay_payment_id;
					const url = `${API_URL}capture/${paymentId}`;
					const captureResponse = await axios.post(url, data);
					console.log(captureResponse.data);
					alert(`Your order has been placed `);
					props.history.push('/');
				} catch (err) {
					console.log(err);
				}
			},
			theme: {
				color: '#000'
			}
		};
		const rzp1 = new window.Razorpay(options);
		rzp1.open();
	};
	//=======================================================================//
	const onOrder = (e) => {
		e.preventDefault();
		if (select === 'ONLINE') {
			paymentHandler();
		} else {
			const data = {
				price: price,
				order: localStorage.getItem('cart'),
				address: address,
				token: localStorage.getItem('uToken')
			};
			axios.post('http://localhost:5050/user/ordercod', data).then((res) => {
				console.log(res);
				props.history.push('/');
				alert(`Your order has been placed `);
			});
		}
	};

	//=======================================================================//
	const onAddHandler = (index) => {
		const item = order.data[index];
		item.count = order.data[index].count + 1;
		const arr = order.data;
		arr[index] = item;
		localStorage.setItem('cart', JSON.stringify(arr));
		setData({
			data: arr
		});
		const totalArrCount = arr.map((item) => item.count);
		const totalCount = totalArrCount.reduce((a, b) => a + b, 0);
		setCount(totalCount);
		const totalArr = arr.map((item) => item.count * item.price);
		const total = totalArr.reduce((a, b) => a + b, 0);
		setPrice(total);
	};
	const onRemoveHandler = (index) => {
		const item = order.data[index];
		item.count = order.data[index].count - 1;
		const arr = order.data;
		if (item.count <= 0) {
			arr.splice(index, 1);
			localStorage.setItem('cart', JSON.stringify(arr));
			setData({
				data: arr
			});
		} else {
			arr[index] = item;
			localStorage.setItem('cart', JSON.stringify(arr));
			setData({
				data: arr
			});
		}
		const totalArrCount = arr.map((item) => item.count);
		const totalCount = totalArrCount.reduce((a, b) => a + b, 0);
		setCount(totalCount);
		const totalArr = arr.map((item) => item.count * item.price);
		const total = totalArr.reduce((a, b) => a + b, 0);
		setPrice(total);
	};

	const onDeleteHandler = (index) => {
		const item = order.data[index];
		item.count = order.data[index].count - order.data[index].count;
		const arr = order.data;
		if (item.count <= 0) {
			arr.splice(index, 1);
			localStorage.setItem('cart', JSON.stringify(arr));
			setData({
				data: arr
			});
		} else {
			arr[index] = item;
			localStorage.setItem('cart', JSON.stringify(arr));
			setData({
				data: arr
			});
		}
		const totalArrCount = arr.map((item) => item.count);
		const totalCount = totalArrCount.reduce((a, b) => a + b, 0);
		setCount(totalCount);
		const totalArr = arr.map((item) => item.count * item.price);
		const total = totalArr.reduce((a, b) => a + b, 0);
		setPrice(total);
	};

	const onSelect = (e) => {
		console.log(e.target.value);
		setSelect(e.target.value);
	};
	const classes = useStyles();
	let button = (
		<Fragment>
			<Link style={{ textDecoration: 'none' }} to="/login">
				<Button className={classes.button}>Login</Button>
			</Link>
			<Link style={{ textDecoration: 'none' }} to="/register">
				<Button className={classes.button}>Register</Button>
			</Link>
		</Fragment>
	);
	if (props.token) {
		button = (
			<Link style={{ textDecoration: 'none' }} onClick={() => props.onLogout()} to="/logout">
				<Button className={classes.button}>Logout</Button>
			</Link>
		);
	}
	let cards = <h1>....Add items to use the card</h1>;
	if (order.data) {
		cards = (
			<main>
				<Container style={{ marginTop: '10px' }}>
					<Grid container className={classes.root} spacing={2}>
						<Grid item xs={12}>
							<Grid container justify="center" spacing={5}>
								{' '}
								<Grid key="1" item>
									<div>
										<Paper elevation={3} className={classes.paper}>
											{order.data.map((item, index) => (
												<Paper className={classes.paper1}>
													<Grid container wrap="nowrap" spacing={2}>
														<Grid item>
															<Avatar>
																<img
																	height="100%"
																	width="100%"
																	src={item.image.thumbnail}
																/>
															</Avatar>
														</Grid>
														<Grid item xs>
															<Typography>
																{item.title} X{' '}
																<Typography
																	variant="button"
																	display="inline"
																	color="textSecondary"
																>
																	{item.count}
																</Typography>
															</Typography>
															<Typography>
																₹{item.price}/{item.unit}
															</Typography>
														</Grid>
														<Grid>
															<IconButton onClick={() => onRemoveHandler(index)}>
																<RemoveIcon />
															</IconButton>
														</Grid>
														<Grid>
															<IconButton onClick={() => onAddHandler(index)}>
																<AddIcon />
															</IconButton>
														</Grid>
														<Grid>
															<IconButton onClick={() => onDeleteHandler(index)}>
																<CancelIcon />
															</IconButton>
														</Grid>
													</Grid>
												</Paper>
											))}
										</Paper>
									</div>
								</Grid>
								<Grid key="1" item>
									<Paper component="div" elevation={3} className={classes.paper}>
										<Grid>
											<div style={{ margin: 10 }}>
												<Card style={{ marginTop: 10 }}>
													<CardContent>
														<Typography variant="h6">Total Amount : {price}</Typography>
														<Typography style={{ marginTop: 10 }} variant="h5">
															Total Items : {count}
														</Typography>
													</CardContent>
												</Card>
												<form onSubmit={onOrder}>
													<Card style={{ marginTop: 10 }}>
														<CardContent>
															<Typography variant="h6">Address</Typography>
															<TextField
																required
																name="address"
																className={classes.form}
																label="Address"
																value={address}
																onChange={(e) => setAddress(e.target.value)}
															/>
														</CardContent>
													</Card>
													<Card style={{ marginTop: 10 }}>
														<CardContent>
															<Typography variant="h6">Mode of payment</Typography>
															<Select
																onChange={onSelect}
																style={{ minWidth: 150 }}
																native
															>
																<option value="COD">Cash on Delivery</option>
																<option value="ONLINE">Online Payment</option>
															</Select>
														</CardContent>

														<CardContent style={{ margin: 'auto' }}>
															{props.token ? (
																<Button
																	variant="contained"
																	color="primary"
																	type="submit"
																>
																	ORDER NOW
																</Button>
															) : (
																<Link to="/login" style={{ textDecoration: 'none' }}>
																	<Button
																		variant="contained"
																		color="primary"
																		type="submit"
																	>
																		LOGIN TO ORDER
																	</Button>
																</Link>
															)}
														</CardContent>
													</Card>
												</form>
											</div>
										</Grid>
									</Paper>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
				</Container>
			</main>
		);
	}
	return (
		<Fragment>
			<CssBaseline />
			<AppBar color="transparent" position="relative">
				<Toolbar>
					<Typography variant="h6" color="inherit" noWrap>
						<Link to="/">
							<img alt="logo" src={logo} />
						</Link>
					</Typography>
					<div style={{ marginLeft: 'auto' }}>{button}</div>
				</Toolbar>
			</AppBar>
			{cards}
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	return {
		token: state.user.login,
		error: state.user.error,
		loading: state.user.loading
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onLogout: () => dispatch(actionCreators.logoutUser()),
		checkAuth: () => dispatch(actionCreators.check())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
