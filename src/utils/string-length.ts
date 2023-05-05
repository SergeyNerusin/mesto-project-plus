function checkStringLength(v: string, min: number, max: number): boolean {
  return v.trim().length >= min && v.trim().length <= max;
}
export default checkStringLength;
