import { FileFilterCallback } from 'multer';

export const recipeUploadFileFilter = (
  _,
  file: Express.Multer.File,
  callback: FileFilterCallback,
) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
    return callback(new Error('Only image files are allowed!'));
  }
  callback(null, true);
};
