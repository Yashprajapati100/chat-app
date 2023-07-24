const jwt=require('jsonwebtoken');

class Auth{
    // async requireAuth(req,res,next){
    //     const token=await db.query(`SELECT * FROM users WHERE token='${req}'`)
    // }

    async requireAuth(req, res, next) {
        try {
            if (req.session.token != null && req.session.token != '') {
                let token = req.session.token;
                var decoded = jwt.verify(token, 'practice')
                if (decoded.iat < decoded.exp) {
                    next();
                }
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.log(error);
            res.redirect('/login');
        }
    }

}

module.exports=new Auth