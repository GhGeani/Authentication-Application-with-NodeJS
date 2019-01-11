const router    = require('express').Router();
const controller = require('../../controllers/userProfileControllers/contactController');
router.route('/home/:page')
    .get((req,res) => {
        if(req.session.username == undefined) {
            res.status(404).send();
        } else {
            let { page } = req.params;
            let numOfPages = 0;
            let offsets = [];
            let numOfContacts = 0;
            let limit = 10;
            
            req.getConnection((err, conn) => {
                if(err){
                    // Flash connectin err
                }else {
                    conn.query("SELECT COUNT(*) AS NoOfContacts FROM contact JOIN user_contact ON contact.id = user_contact.id_contact WHERE user_contact.id_user = ?;", [req.session.user_id], (err, result) => {
                        numOfContacts = result[0].NoOfContacts;

                        if(numOfContacts % limit != 0){
                            numOfPages = Math.ceil(numOfContacts / limit);
                        } else {
                            numOfPages = numOfContacts / limit;
                        }

                        if(page < 0 || page > numOfPages){
                            res.send('PAGE NOT FOUND',404);
                        }
                        
                        offsets[1] = 0;
                        for(let i = 2; i <= numOfPages; i++){
                            offsets[i] = offsets[i-1] + limit;
                        }

                        conn.query('SELECT * FROM user_contact JOIN contact ON user_contact.id_contact = contact.id WHERE user_contact.id_user = ? LIMIT ? OFFSET ?;', [req.session.user_id, limit, offsets[page]], (err, results) =>{
                            res.render('userProfile/homepage-profile', {
                                title: `${req.session.username}'s Profile`,
                                data:  results,
                                noContacts: numOfContacts,
                                noPages:    numOfPages
                            });
                        });
                    });
                }
            });
        }
    })
    .post(controller.search)
    
router.route('/')
    .get((req,res) => {
        res.redirect('/my-profile/home/1');
    });

module.exports  = router;