import { Amplify } from "aws-amplify";

const {
	VITE_AWS_REGION: AWS_REGION,
	VITE_USER_POOLID: USER_POOLID,
	VITE_USER_POOL_WEB_CLIENTID: USER_POOL_WEB_CLIENTID,
	VITE_OAUTH_DOMAIN: OAUTH_DOMAIN,
	VITE_OAUTH_REDIRECT_SIGNIN: OAUTH_REDIRECT_SIGNIN,
	VITE_OAUTH_REDIRECT_SIGNOUT: OAUTH_REDIRECT_SIGNOUT,
	VITE_AUTH_DOMAIN:domain
} = import.meta.env;

const awsConfig = {
	// REQUIRED - Amazon Cognito Region
	region: AWS_REGION,
	// OPTIONAL - Amazon Cognito User Pool ID
	userPoolId: USER_POOLID,
	// OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
	userPoolWebClientId: USER_POOL_WEB_CLIENTID,
	// OPTIONAL - Hosted UI configuration
	oauth: {
		domain: OAUTH_DOMAIN,
		scope: ["email", "profile", "openid", "aws.cognito.signin.user.admin"],
		redirectSignIn: OAUTH_REDIRECT_SIGNIN,
		redirectSignOut: OAUTH_REDIRECT_SIGNOUT,
		responseType: "code", // or 'token', note that REFRESH token will only be generated when the responseType is code
	},
	cookieStorage: { secure: false, domain: ".attryb.com" },
	aws_cognito_username_attributes: ["EMAIL"],
	aws_cognito_social_providers: ["Google"],
	aws_cognito_signup_attributes: ["EMAIL"],
	aws_cognito_verification_mechanisms: ["EMAIL"],
};

Amplify.configure(awsConfig);