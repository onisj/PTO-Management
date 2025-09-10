// authentication.js
const addAuthToHeader = (request, z, bundle) => {
    // Add the Airtable API token to request headers
    request.headers.Authorization = `Bearer ${bundle.authData.apiToken}`;
    return request;
};

const testAuth = async (z, bundle) => {
    // Test the authentication by fetching user info
    const response = await z.request({
        url: 'https://api.airtable.com/v0/meta/whoami',
        method: 'GET',
    });

    if (response.status !== 200) {
        throw new z.errors.Error('Authentication failed', 'AuthenticationError');
    }

    return response.data;
};

export default {
    type: 'custom',

    // Fields that users need to provide
    fields: [
        {
            computed: false,
            key: 'apiToken',
            required: true,
            label: 'Airtable API Token',
            type: 'password',
            helpText: 'Get your API token from https://airtable.com/account'
        },
        {
            computed: false,
            key: 'baseId',
            required: true,
            label: 'Base ID',
            type: 'string',
            helpText: 'Find your Base ID in the Airtable API documentation for your base'
        }
    ],

    // Test function to verify credentials
    test: testAuth,

    // This function runs before every HTTP request
    connectionLabel: '{{id}} - {{email}}',
};

// Export the auth header function to be used in beforeRequest
export { addAuthToHeader };
