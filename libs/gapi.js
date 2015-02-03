var googleapis = require('googleapis'),
    OAuth2Client = googleapis.OAuth2Client,
    client = '<put your Client ID here!>',
    secret = '<put your Client secret here!>',
    redirect = 'http://localhost:3000/oauth2callback',
    calendar_auth_url = '',
    oauth2Client = new OAuth2Client(client, secret, redirect);

exports.ping = function() {
    console.log('pong');
};