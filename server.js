const express = require('express');
require('dotenv').config();
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const checkScope = require("express-jwt-authz");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,//Used to prevent attacks
    jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuser: `https://${process.env.REACT_APP_AUTH0_DOMAIN}`,

  algorithms: ["RS256"]

});

const app = express();

app.get("/public", function(req, res) {
    res.json({
      message: "Hello from a public API!"
    });
  });

app.get("/private", checkJwt, function(req, res) {
    res.json({
      message: "Hello from a private API!"
    });
  });

app.get("/course", checkJwt, checkScope(["read:courses"]), function(req,res) {
  res.json({
    courses: [
      {id: 1 , title: "Building apps with react and redux" },
      {id: 1 , title: "Creating Reusables React Components" },
    ]
  });
});

app.listen(3001);
console.log('API server listening on ' + process.env.REACT_APP_API_URL);