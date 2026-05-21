export function encodeCursor(state: object) {
  return Buffer.from(JSON.stringify(state)).toString("base64");
}

export function decodeCursor(cursor?: string) {
  if (!cursor) return null;
  return JSON.parse(Buffer.from(cursor, "base64").toString());
}