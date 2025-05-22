import "fabric";

declare module "fabric" {
  interface Object {
    id?: string;
    clone(callback?: (clone: Object) => void): Object;
  }
  interface IText {
    id?: string;
  }
}
