const querystring = require('querystring');

exports.handler = async (event) => {
    try {
        // Extract client ID and client secret from the query parameters
        const clientId = event.queryStringParameters.client_id;
        const clientSecret = event.queryStringParameters.client_secret;

        // Extract code from the query parameters
        const code = event.queryStringParameters.code;

        // Validate the client ID and client secret
        const isValidClient = validateClient(clientId, clientSecret);

        if (isValidClient) {
            // Your logic to authenticate the user using the provided code
            const isAuthenticated = authenticateUser(code);

            if (isAuthenticated) {
                // Redirect the user to the specified Cognito login page
                const redirectUrl = `https://tollacred.auth.us-east-1.amazoncognito.com/login?${querystring.stringify({
                    client_id: clientId,
                    response_type: 'code',
                    scope: 'email openid phone',
                    redirect_uri: 'https://tollacred-app-dev.s3-website-us-east-1.amazonaws.com/dashboard.html'
                })}`;

                return {
                    statusCode: 302,
                    headers: {
                        Location: redirectUrl,
                    },
                };
            } else {
                return {
                    statusCode: 401,
                    body: JSON.stringify({ message: 'Authentication failed' }),
                };
            }
        } else {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Unauthorized - Invalid client ID or client secret' }),
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error', error: error.message }),
        };
    }
};
