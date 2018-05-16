const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');

AWS.config.update({
    accessKeyId: 'AKIAIAANE37CSOGOIE4A',
    secretAccessKey: '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',
    region: 'ap-south-1'
});

const S3 = new AWS.S3({});

const upload = multer({
    storage: multerS3({
        s3:S3,
        bucket: 'chatapp',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function(req, file, cb){
            cb(null, file.originalname);
        }
    }),

    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase();
    }
       
    
})

module.exports.Upload = upload;