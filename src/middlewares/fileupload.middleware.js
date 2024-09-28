
// //1. Import multer
// import multer from "multer";

// //2. Configure the storage with filename and location
// const storage = multer.diskStorage({
//     destination: (req, file, cb)=>{
//         cb(null, './uploads/');
//     },
//     filename:(req, file, cb)=>{
//         cb(null, new Date().toISOString() + file.originalname);
//     },
// });



// export const upload = multer({storage: storage});


// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure the uploads directory exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, './uploads/');
//     },
//     filename: (req, file, cb) => {
//         const timestamp = new Date().toISOString().replace(/:/g, '-');
//         cb(null, `${timestamp}-${file.originalname}`);
//     },
// });

// export const upload = multer({ storage: storage });

import multer from "multer";

// Configure the storage with filename and location
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        cb(null, `${timestamp}-${file.originalname}`);
    },
});

export const upload = multer({ storage: storage });