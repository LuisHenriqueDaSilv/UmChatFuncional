import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'database/images/');
    },
    filename: (req, file, cb) => {
        const filename = `${uuidv4()}.png`;
        cb(null, filename);
    },
});


export default multer({
    storage,
    fileFilter: (req, file, cb) => {
        
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/jpg"
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
            //@ts-ignore
            req.fileAccepted = true;
        } else {
            //@ts-ignore
            req.fileAccepted = false;
            cb(null, false);
        }
    },
});