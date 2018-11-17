const router     = require('express').Router();
const controller = require('../../controllers/authenticationController/authentificationController')

router.route('/register')
    .get((req,res) => {
        if(req.session.username){
            res.redirect('/my-profile');
        }
        res.render('authentification/register',{
            title: 'Register Page',
            username:   '',
            email:      '',
            password:   '',
            repeat_password: ''
        })
    })
    .post(controller.registerUser);

module.exports = router;