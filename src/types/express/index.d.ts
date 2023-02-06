export {};

import type { Models } from "../../models/types";
import { Express } from "express-serve-static-core";
// src/types/express/index.d.ts

declare module 'express-serve-static-core' {
  interface Request {
    models?: Models;
  }
}