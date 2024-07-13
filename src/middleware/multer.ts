import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Set storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './src/uploads'

    // Check if the directory exists, if not, create it
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }) // Create directory recursively
    }

    cb(null, dir)
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  }
})

// Check file type
const checkFileType = (file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg/ // only jpeg and jpg
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Images only!'))
  }
}

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb)
  }
}).single('profileImage')

export default upload
