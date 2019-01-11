const router    = require('express').Router();

router.route('/homepage')
    .get((req,res) => {
        if(req.session.username){
            res.redirect('my-profile/home/1')
        }else {
            res.render('homepage', {
                title: 'Homepage'
            });
        }  
    })
    .post();


router.route('/')
    .get((req,res) => {
        res.redirect('/homepage');
    });

module.exports  = router;