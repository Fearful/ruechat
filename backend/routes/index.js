module.exports = function(app){
	var express = require('express'),
		path = require('path'),
		passport = require('passport'),
		Account = require('../model/account');
	/// Account CRUD
	app.get('/register', function(req, res) {
	    res.render('index', { });
	});
	app.post('/register', function(req, res) {
	    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
	        if (err) {
	            return res.render("register", {info: "Sorry. That username already exists. Try again."})
	        }
	        passport.authenticate('local')(req, res, function () {
	            res.redirect('/');
	        });
	    });
	});
	app.get('/login', function(req, res) {
	    res.render('index', { user : req.user });
	});
	app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), function(req, res) {
	    res.send(req.user);
	});
	app.get('/logout', function(req, res) {
	    req.logout();
	    res.redirect('/');
	});
	// Set up main paths
	app.get('/', function(req, res){
	  res.render('index');
	});
	app.get('/partials/:name', function (req, res) {
	  var name = req.params.name;
	  res.render('partials/' + name);
	});
	app.use('/static', express.static(path.join(__dirname, '../../frontend')));
	app.get('*', function(req, res){
	  res.render('/');
	});
};