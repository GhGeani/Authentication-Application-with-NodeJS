
validation = ( inputFields) => {
    // Contact Validation
        inputFields.checkBody("first_name").notEmpty().withMessage("First name field it's empty")
                                    .isLength({min: 3}).withMessage("First name must contain 3 letters at least")
                                    .isAlpha().withMessage("First name must contain only letter");
        inputFields.checkBody("second_name").notEmpty().withMessage("Second name field it's empty")
                                        .isLength({min: 3}).withMessage("Second name must contain 3 letters at least")
                                        .isAlpha().withMessage("Second name must contain only letter");
        inputFields.checkBody("phone_number").notEmpty().withMessage("Phone number field is empty")
                                            .isInt().withMessage("This must be a phone number")
                                            .isLength({min: 10, max: 10}).trim().withMessage("Phone number must have exactly 10 digits");
        var errors = inputFields.validationErrors();
        return errors

} 

module.exports.create = (req,res) => {
    var errors = validation(req);
    var contact = {
        first_name:     req.sanitize('first_name').trim(),
        second_name:    req.sanitize('second_name').trim(),
        phone_number:   req.sanitize('phone_number').trim(),
     }

     if(errors){
        req.flash('error', 'Input ERROR. Check console.');
        console.log(errors);
        res.render('userProfile/contact/create', {
            title: 'Create Contact',
            first_name:     contact.first_name,
            second_name:    contact.second_name,
            phone_number:   contact.phone_number
        })
     } else {
        req.getConnection((err, conn) =>{
            if(err){
                // Flash database err
            } 
            conn.query('select * from user_contact uc join contact c on uc.id_contact = c.id where uc.id_user = ?', req.session.user_id, (err, results) =>{
                if(err) {
                    // Flash error 
                }

                phoneNumberValidation = (length) => {
                    for(var i = 0; i < length; i++){
                        if(results[i].phone_number == req.body.phone_number){
                             return true;
                        }
                    }
                }

                if(phoneNumberValidation(results.length) == true){
                    // Flash Phone number already exist error
                    req.flash('error', 'Phone number is already registred in other contact');
                    console.log('Phone number is already registred in other contact');
                    res.render('userProfile/contact/create', {
                        title: 'Create Contact',
                        first_name:     contact.first_name,
                        second_name:    contact.second_name,
                        phone_number:   contact.phone_number
                    })
                } else {
                    conn.query('insert into contact set ?', contact, (err,result) => {
                        if(err) throw err;
                        console.log(`New Contact inserted with id = ${result.insertId}`)
                        var newLink = {
                            id_user:         req.session.user_id,
                            id_contact:      result.insertId
                        }
                        conn.query('insert into user_contact set ?', newLink, (err,result) =>{
                            if(err) throw err;
                            console.log(`New link created between id_user = ${req.session.user_id} and id_contact = ${newLink.id_contact}.`);
                            req.flash('success', `Account successifully created.`)
                            res.redirect('/');
                        });
                    });
                }
            })
        });
     }
}

module.exports.update = (req,res) => {
    var { id } = req.params;

    var errors = validation(    req);
    var contact = {
        first_name:     req.sanitize('first_name').trim(),
        second_name:    req.sanitize('second_name').trim(),
        phone_number:   req.sanitize('phone_number').trim(),
     }

     if(errors){
        // Flash contact errors
        req.flash('error', 'Input ERRORS. Check console');
        console.log(errors);
        res.render('userProfile/contact/update', {
            title: 'Update Contact',
            first_name:     contact.first_name,
            second_name:    contact.second_name,
            phone_number:   contact.phone_number
        })
     } else {
        req.getConnection((err, conn) =>{
            if(err){
                // Flash database err
            } 
            conn.query('SELECT * FROM user_contact uc JOIN contact c ON uc.id_contact = c.id WHERE uc.id_user = ? AND c.id= ?', [req.session.user_id, id], (err, results) =>{
                if(err) {
                    // Flash error 
                }

                phoneNumberValidation = (length) => {
                    for(var i = 0; i < length; i++){
                        if(results[i].phone_number == req.body.phone_number){
                             return true;
                        }
                    }
                }

                if(phoneNumberValidation(results.length) == true){
                    // Flash Phone number already exist error
                    req.flash('error', 'Phone number is already registred in other contact');
                    console.log('Phone number is already registred in other contact');
                    res.render('userProfile/contact/update', {
                        title: 'Update Contact',
                        first_name:     contact.first_name,
                        second_name:    contact.second_name,
                        phone_number:   contact.phone_number
                    })
                } else {
                    conn.query('UPDATE contact SET ? WHERE contact.id = ?', [contact,id], (err,result) => {
                        if(err) throw err;
                        req.flash('success', `Account successifully updated.`)
                        console.log(`Contact with id with id = ${id} updated.`);
                        res.redirect('/');
                    });
                }
            })
        });
     }
}