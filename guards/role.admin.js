const jwt = require("jsonwebtoken");

// This middleware checks if the user has the role of 'admin' and 'creator'.
// If the user is an admin or creator, it allows access to the route.
