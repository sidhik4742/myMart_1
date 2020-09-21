import React from 'react';
import './App.css';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './container/admin/login/login';
import Dash from './container/admin/admin';
import Logout from './container/admin/logout';
import LoginDealer from './container/dealer/login';
import DashDealer from './container/dealer/dealer';
import LogoutDealer from './container/dealer/logout';
import Home from './container/user/home';
import LoginUser from './container/user/login';
import RegisterUser from './container/user/register';
import LogoutUser from './container/user/logout';

function App(props) {
	return (
		<div classNameName="App">
			<Switch>
				<Route path="/" exact component={Home} />
				<Route path="/logout" exact component={LogoutUser} />
				<Route path="/login" exact component={LoginUser} />
				<Route path="/register" exact component={RegisterUser} />
				<Route path="/dealer/login" component={LoginDealer} />
				<Route path="/dealer/dash" component={DashDealer} />
				<Route path="/dealer/logout" component={LogoutDealer} />
				<Route path="/admin/login" component={Login} />
				<Route path="/admin/dash" component={Dash} />
				<Redirect path="/admin/dash" to="/admin/login" />
				<Route path="/admin/logout" component={Logout} />
				<Redirect to="/" />
			</Switch>
		</div>
	);
}

const mapStateToProps = (state) => {
	return {
		adminAuth: state.admin.token,
		dealerAuth: state.dealer.token,
		userAuth: state.user.loading
	};
};

export default connect(mapStateToProps, null)(App);
