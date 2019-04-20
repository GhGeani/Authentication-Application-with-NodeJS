const router    = require('express').Router();

router.route('/delete-contact/:id')
    .get((req,res) => {
        var { id } = req.params;
        req.getConnection((err, conn) => {
            if(err){
                // Flash err conn
            } else {
                conn.query('delete user_contact, contact from user_contact join contact on user_contact.id_contact = contact.id where user_contact.id_user= ? and user_contact.id_contact = ?', [req.session.user_id, id], function (err, result) { 
                    if (err){
                        console.log(err);
                    } else {
                        req.flash('success', 'The contact was successifully deleted')
                        console.log(`Contact with id = ${id} deleted.`)
                        res.redirect('/');
                    }
                 });
            }
        });
    })
    .post((req,res) => {
        req.flash('success', 'The contact was successifully deleted')
    });

module.exports  = router;