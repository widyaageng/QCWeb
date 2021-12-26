const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports = function (app, myDataBase) {

    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    };

    // Be sure to change the title
    app.route('/').get((req, res) => {
        //Change the response to render the Pug template
        res.render('pug/index', {
            title: 'Connected to Database',
            message: 'Please login',
            showLogin: true,
            showRegistration: true,
            showSocialAuth: true
        });
    });

    app.post('/login', passport.authenticate('local', {
        failureRedirect: '/'
    }), function (req, res) {
        res.render('pug/profile', {
            username: req.user.username,
        })
    });

    app.route('/register')
        .post((req, res, next) => {
            myDataBase.findOne({ username: req.body.username }, function (err, user) {
                if (err) {
                    next(err);
                } else if (user) {
                    res.redirect('/');
                } else {
                    const hash = bcrypt.hashSync(req.body.password, 12);
                    myDataBase.insertOne({
                        username: req.body.username,
                        password: hash
                    },
                        (err, doc) => {
                            if (err) {
                                res.redirect('/');
                            } else {
                                next(null, doc.ops[0]);
                            }
                        }
                    )
                }
            })
        },
            passport.authenticate('local', { failureRedirect: '/' }),
            (req, res, next) => {
                res.redirect('/profile', {
                    username: req.user.username,
                });
            }
        );

    app.route('/profile')
        .get(ensureAuthenticated, (req, res) => {
            res.render('pug/profile', {
                username: req.user.username,
            });
        });

    app.route('/auth/github')
        .get(passport.authenticate('github'));

    app.route('/auth/github/callback')
        .get(passport.authenticate('github', { failureRedirect: '/' }),
        (req, res, next) => {
            req.session.user_id = req.user.id
            res.render('pug/chat', {
                user: req.user,
            });
        });

    app.route('/chat')
    .get(ensureAuthenticated, (req, res) => {
        res.render('pug/chat', {
            user: req.user
        })
    })

    app.route('/logout')
        .get((req, res) => {
            req.logout();
            res.redirect('/');
        });
};
