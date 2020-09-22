import * as actionTypes from '../actions/user/actionTypes';

const initialState = {
	token: false,
	login: false,
	error: false,
	loading: false,
	otp: null,
	otpToken: null,
	otperror: false,
	success: false
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START_USER_REGISTER_OTP:
			return {
				...state,
				loading: true,
				error: null
			};
		case actionTypes.Auth_USER_OTP_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				otpToken: null,
				token: true,
				success: true
			};
		case actionTypes.AUTH_USER_REGISTER_OTP_FAIL_OTP:
			return {
				...state,
				loading: false,
				otperror: true
			};
		case actionTypes.AUTH_START_USER_REGISTER_OTP_SUCCESS:
			return {
				...state,
				loading: true,
				error: null,
				otpToken: action.token
			};
		case actionTypes.AUTH_START_USER:
			return {
				...state,
				loading: true,
				error: null
			};
		case actionTypes.AUTH_SUCCESS_USER:
			return {
				...state,
				login: true,
				error: null,
				loading: false
			};
		case actionTypes.AUTH_FAIL_USER:
			return {
				...state,
				error: true,
				loading: false
			};
		case actionTypes.AUTH_LOGOUT_USER:
			return {
				...state,
				token: null,
				login: null,
				error: false,
				loading: false,
				otp: null,
				otpToken: null,
				otperror: false
			};
		default:
			return state;
	}
};

export default reducer;
