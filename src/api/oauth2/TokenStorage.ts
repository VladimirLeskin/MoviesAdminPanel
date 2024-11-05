import {LocalStorage} from '../../utils/LocalStorage';
import {IToken} from '../Auth';

export class TokenStorage extends LocalStorage<IToken> {
  public key: string;
  protected migrations: Record<number, (data: unknown) => IToken> = {};
  protected version: number = 1;

  constructor(key: string) {
    super();
    this.key = key;
  }

  public getData(): IToken | null {
    const data = super.getData();
    if (data) {
      return {
        ...data,
        expires: new Date(data.expires),
      };
    }
    return data;
  }
}
