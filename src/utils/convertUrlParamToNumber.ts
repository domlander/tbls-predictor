export function convertUrlParamToNumber(param: string | string[] | undefined) {
  if (!param) return null;

  return typeof param === "string" ? parseInt(param) : parseInt(param[0]);
}
