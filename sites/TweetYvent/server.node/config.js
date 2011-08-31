var config = {};

config.restartDB = false;

config.twitterNode = {
	user: "browserX",
	password: "passwordhere",
	action: "filter",
	track: [],
	follow: []
};

config.mongo = {
	host: 'localhost' //if connecting to a remote mongoDB change this to your remote ip address or domain
};

config.email = {
	server: "smtp.gmail.com",
	port: "465",
	ssl: true,
	username: "username@gmail.com",
	pass: "my.password",
	to: "myfriend@example.com",
	from: "me@example.com"
}

module.exports = config;