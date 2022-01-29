export function isEmpty(obj: any) {
  if (Object.keys(obj).length) {
    return false;
  }
  return true;
}