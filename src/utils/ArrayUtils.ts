export class ArrayUtils {
  public static removeEmpty<T>(items: T[]): NonNullable<T>[] {
    return items.filter(i => i != null) as NonNullable<T>[];
  }
}
