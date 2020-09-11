import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const uploads = path.resolve(__dirname, '..', '..', 'uploads');

export default {
  uploads,
  storage: multer.diskStorage({
    destination: uploads,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const filename = `${fileHash}-${file.originalname}`;

      return callback(null, filename);
    },
  }),
};
