interface StorageObject<TData> {
  data: TData;
  version: number;
}

export abstract class LocalStorage<TData> {
  public abstract readonly key: string;
  protected abstract migrations: Record<number, (data: unknown) => TData>;
  protected abstract version: number;

  public getData(): TData | null {
    try {
      const obj: StorageObject<TData> | TData = JSON.parse(localStorage.getItem(this.key) ?? 'null');
      if (LocalStorage.isStorageObject<TData>(obj)) {
        return this.applyMigrations(obj);
      }
      return this.applyMigrations({data: obj, version: 1});
    } catch {
      return null;
    }
  }

  public setData(value: TData) {
    const obj: StorageObject<TData> = {
      data: value,
      version: this.version,
    };
    localStorage.setItem(this.key, JSON.stringify(obj));
  }

  public readonly delete = () => {
    localStorage.removeItem(this.key);
  };

  private applyMigrations(obj: StorageObject<TData>) {
    let data = obj.data;
    for (let i = obj.version; i < this.version; i++) {
      const migration = this.migrations[i];
      data = migration ? migration(data) : data;
    }

    return data;
  }

  private static isStorageObject<TData>(value: unknown): value is StorageObject<TData> {
    return typeof value === 'object' && value != null && 'data' in value && 'version' in value;
  }
}
