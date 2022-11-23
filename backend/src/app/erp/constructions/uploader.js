import multer from "multer";

const Upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 10 * 1024 * 1024, // no larger than 5mb, you can change as needed.
    },
});

export default Upload;