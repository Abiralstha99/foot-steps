declare module "express" {
  // Local minimal typings to unblock TS in this repo without installing @types/express.
  // Replace with `npm i -D @types/express` when network access is available.
  export type Request = any;
  export type Response = any;

  const express: any;
  export default express;
}

declare global {
  namespace Express {
    interface Auth {
      userId: string;
      [key: string]: any;
    }
    interface Request {
      auth: () => Auth;
      [key: string]: any;
    }
    interface Response {
      [key: string]: any;
    }
    namespace Multer {
      interface File {
        [key: string]: any;
      }
    }
  }
}

export {};
