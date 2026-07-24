import multer from "multer";

const mimeType = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/bmp",
  "image/webp",
];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./public/uploads");
  },

  filename(req, file, cb) {
    const extension = file.mimetype.split("/").pop();

    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}.${extension}`
    );
  },
});

const upload = multer({
  storage,

  fileFilter(req, file, cb) {
    if (!mimeType.includes(file.mimetype)) {
      req.multerError = true;
      return cb(null, false);
    }

    cb(null, true);
  },
});

export default upload;