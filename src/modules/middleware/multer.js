const multer = require('multer');
const path = require('path');
// require('../../../public/user')

    const uploads = multer({
        storage: multer.diskStorage({
            destination: function (req, res, cb) {
                // cb(null, 'public')
                cb(null, 'public/user')
            },
            filename: function (req, file, cb) {
                // cb(null,file.fieldname+'-'+Date.now()+'.jpg');
                cb(null, Date.now() + '-' + file.originalname);

            }

        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/jpg' || file.mimetype == 'image/png' || file.mimetype == 'image/svg') {
                cb(null, true)
            }
            else {
                cb(null, false)
                return cb(new Error('Only Jpeg, jpg Image Allow'))
            }
        }
    })

module.exports = uploads