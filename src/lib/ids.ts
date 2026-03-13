import { nanoid } from "nanoid";

export function newFormSlug() {
  return nanoid(10);
}

