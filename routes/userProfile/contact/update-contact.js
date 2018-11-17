const router        = require('express').Router();
const controller    = require('../../../controllers/userProfileControllers/contactController');

router.route('/update-contact/:id')
    .get((req,res) => {
        if(req.session.username == undefined) {
            res.status(404).send();
        } else {
            var { id } = req.params;
            req.getConnection((err, conn) => {
                conn.query('SELECT * FROM user_contact uc JOIN contact c ON uc.id_contact = c.id WHERE uc.id_user = ? AND c.id= ?', [req.session.user_id, id], (err, result) =>{
                    //console.log(result);
                    res.render('userProfile/contact/update', {
                        title:          'Update contact',
                        id:             id,
                        first_name:     result[0].first_name,
                        second_name:    result[0].second_name,
                        phone_number:   result[0].phone_number
                    });
                });
               
            });
            
        }
    })
    .post(controller.update);

module.exports  = router;