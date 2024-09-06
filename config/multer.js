
const multer =require('multer');

const storage = multer.memoryStorage();


function fileFilter( req,file,cb){
var accepted = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/jpg',
    'image/webp,'
]
if(accepted.indexOf(file.mimetype) !== -1){
    cb(null, true)
} else {
    var files = accepted.map((e)=>{
    return e.split('/')[1]
    })
    cb(new Error(`We only accept files like ${files.join(", ")} and image `), false)
}
}

const upload = multer({ storage: storage , fileFilter :fileFilter,limits:{fileSize:2*1024*1024}})

module.exports = upload;