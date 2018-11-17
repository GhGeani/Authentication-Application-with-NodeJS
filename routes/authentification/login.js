const router     = require('express').Router();
const controller = require('../../controllers/authenticationController/authentificationController');

router.route('/login')
    .get((req,res) => {

        if(req.session.username){
            res.redirect('/my-profile');
        } else {
            res.render('authentification/login', {
                title:      'Login page',
                username:   '',
                password:   ''
            });
        }
    })
    .post(controller.loginUser);

router.route('/logout')
    .get((req,res) => {
        console.log('Session out!');
        req.session.destroy();
        res.redirect('/');
    });


module.exports   = router;