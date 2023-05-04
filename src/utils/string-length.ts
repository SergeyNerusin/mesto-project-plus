function checkStringLength(v: string, min: number, max: number): boolean {
  return v.replaceAll(' ', '').length > min && v.length < max;
}
export default checkStringLength;
