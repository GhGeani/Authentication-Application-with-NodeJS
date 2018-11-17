const router        = require('express').Router();
const controller    = require('../../../controllers/userProfileControllers/contactController');

router.route('/create-contact')
    .get((req,res) => {
        if(req.session.username == undefined) {
            res.status(404).send();
        } else {
            res.render('userProfile/contact/create', {
                title:          'Create contact',
                first_name:     '',
                second_name:    '',
                phone_number:   ''    
            });
        }
        
    })
    .post(controller.create);

module.exports  = router;