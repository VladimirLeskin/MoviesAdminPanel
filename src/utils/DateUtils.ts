export class DateUtils {
  public static dateToString(d?: Date) {
    return d && !Number.isNaN(d.getTime())
      ? [d.getDate(), d.getMonth() + 1, d.getFullYear()]
          .map(v => `00${v}`.slice(-Math.max(v.toString().length, 2)))
          .join('.')
      : '';
  }
}
