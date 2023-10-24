import { ValueError } from '@/errors';

export default class Password {
  private value: string;

  constructor(value: string | null = null) {
    if (value === null || value === '') {
      throw new ValueError('Password must be a non-empty string');
    };
    this.value = value;
  };

  toString(): string {
    return this.value;
  };
}
