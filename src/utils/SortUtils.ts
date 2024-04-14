export class SortUtils {
  public static numeric(a?: number | null, b?: number | null) {
    if (a == null && b == null) {
      return 0;
    } else if (a == null) {
      return -1;
    } else if (b == null) {
      return 1;
    }

    return a - b;
  }
}
