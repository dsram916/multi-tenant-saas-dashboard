import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // Save files to the 'uploads' folder
  },
  filename(req, file, cb) {
    // Create a unique filename
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// --- THIS IS THE FIX ---
// This new function is much simpler and accepts all image types
function checkFileType(file, cb) {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
}
// --- END OF FIX ---

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
// --- End Multer Config ---

router.post('/', upload.single('image'), (req, res) => {
  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl: `/${req.file.path}`, 
  });
});

export default router;