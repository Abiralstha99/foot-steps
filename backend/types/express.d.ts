// Augments the global Express namespace to add Clerk's auth() method.
declare global {
  namespace Express {
    interface Auth {
      userId: string;
      [key: string]: any;
    }
    interface Request {
      auth: () => Auth;
      file?: Multer.File;
      files?: {
        [fieldname: string]: Multer.File[];
      } | Multer.File[];
    }
    namespace Multer {
      interface File {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      }
    }
  }
}

export { };
