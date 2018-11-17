const router    = require('express').Router();

router.route('/home')
    .get((req,res) => {
        if(req.session.username == undefined) {
            res.status(404).send();
        } else {
            req.getConnection((err, conn) => {
                if(err){
                    // Flash connectin err
                }else {
                    conn.query('select * from user_contact uc join contact c on uc.id_contact = c.id where uc.id_user = ?', [req.session.user_id], (err, results) =>{
                        res.render('userProfile/homepage-profile', {
                            title: `${req.session.username}'s Profile`,
                            data:  results
                        });
                    });
                }
            });
              
        }
    })

router.route('/')
    .get((req,res) => {
        res.redirect('/my-profile/home');
    });

module.exports  = router;