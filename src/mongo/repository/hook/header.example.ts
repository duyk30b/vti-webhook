const headerExample1 = {
	value: { x_authenticator: 'Bearer $_access_token_$' },
	depend: '_access_token_',
	loader: {
		_access_token_: {
			depend: '_refresh_token_',
			timeToLive: 5 * 60 * 1000, // 5 minutes
			type: 'ResponseAPI',
			url: 'http://10.1.14.122:4001/api/v1/auth/refreshToken',
			method: 'POST',
			body: { refreshToken: '$_refresh_token_$' },
			header: { refreshToken: '$_refresh_token_$' },
			responseDataPath: 'data.data.accessToken',
		},
		_refresh_token_: {
			timeToLive: 7 * 24 * 60 * 60 * 1000, // 7 days
			type: 'ResponseAPI',
			url: 'http://10.1.14.122:4001/api/v1/auth/refreshToken',
			method: 'POST',
			header: { lang: 'vi' },
			body: { username: 'demo', password: 'Abc@123' },
			responseDataPath: 'data.data.refreshToken',
		},
	},
}

const headerExample2 = {
	value: { x_authenticator: 'Bearer $_access_token_$' },
	curl: `curl -X 'POST' \
		'http://10.1.14.122:4001/api/v1/auth/login' \
		-H 'accept: application/json' \
		-H 'Content-Type: application/json' \
		-d '{
		"username": "admin",
		"password": "snp1234567"
	}'`,
	responsePath: 'data.data',
	statusCodeTrigger: 401,
}
