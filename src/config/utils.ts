export const escapeRegExp = (text: any) => {
  return text.replace(/[-[\]{}()*+?.,\\$|#\s]/g, '\\$&')
}
