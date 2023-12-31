const userModel = require('../models/users.m');
const bcrypt = require('bcrypt');

module.exports = {
    logIn: async(req, res, next) => {
        try {
            // console.log("LOGIN", req);
            const query = await userModel.getByUN(req.body.un);
            const passwordInDB = query.Password;
            // console.log('DB PW', passwordInDB);

            let match = bcrypt.compareSync(req.body.pw, passwordInDB);

            if (match) {
                // req.session.uid = req.user.ID;
                req.session.un = req.body.un;
                req.session.pw = req.body.pw;
                if (req.body.rememberMe) {
                    req.session.cookie.maxAge = 30 * 24 * 60 * 60;
                    res.cookie('rememberedUsername', req.body.un, { maxAge: 2592000, httpOnly: true });

                } else {
                    req.session.cookie.expires = false;
                }
                // console.log('COOKIE', req.session.cookie);
                res.redirect('/categories');
            } else {
                res.redirect('/'); //Quay lai trang log in
            }
            
            
            // console.log(req.user);
            // console.log("PASSWORD", req.session.pw);
            // console.log("USNAME", req.session.un);
           
            
        } catch (error) {
            next(error);
        }
    }
}