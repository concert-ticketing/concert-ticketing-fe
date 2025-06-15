import 'fabric';

declare module 'fabric' {
  interface Object {
    id?: string;
    clone(callback?: (clone: Object) => void): Object;
    price?: string | number;
  }
}
