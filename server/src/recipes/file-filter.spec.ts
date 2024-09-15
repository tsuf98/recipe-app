import { FileFilterCallback } from 'multer';
import { recipeUploadFileFilter } from './file-filter';

describe('recipeUploadFileFilter', () => {
  it('should allow image files with valid MIME types', (done) => {
    const mockFile = { mimetype: 'image/jpeg' } as Express.Multer.File;
    const callback = (error: Error | null, acceptFile: boolean) => {
      expect(error).toBeNull();
      expect(acceptFile).toBe(true);
      done();
    };

    recipeUploadFileFilter({}, mockFile, callback as FileFilterCallback);
  });

  it('should allow image files with valid MIME types (png)', (done) => {
    const mockFile = { mimetype: 'image/png' } as Express.Multer.File;
    const callback = (error, acceptFile) => {
      expect(error).toBeNull();
      expect(acceptFile).toBe(true);
      done();
    };

    recipeUploadFileFilter({}, mockFile, callback as FileFilterCallback);
  });

  it('should reject files with invalid MIME types', (done) => {
    const mockFile = { mimetype: 'application/pdf' } as Express.Multer.File;
    const callback = (error, acceptFile) => {
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Only image files are allowed!');
      expect(acceptFile).toBe(undefined);
      done();
    };

    recipeUploadFileFilter({}, mockFile, callback as FileFilterCallback);
  });

  it('should reject files with invalid MIME types (text)', (done) => {
    const mockFile = { mimetype: 'text/plain' } as Express.Multer.File;
    const callback = (error, acceptFile) => {
      expect(error).toBeInstanceOf(Error);
      expect(error?.message).toBe('Only image files are allowed!');
      expect(acceptFile).toBe(undefined);
      done();
    };

    recipeUploadFileFilter({}, mockFile, callback as FileFilterCallback);
  });
});
