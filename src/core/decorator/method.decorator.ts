// a sample since I researched it a bit
export const MethodDecorator =
  (path?: string | string[]): MethodDecorator =>
  (
    target: any,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    Reflect.defineMetadata('path', path, descriptor.value);
    Reflect.defineMetadata('method', 0, descriptor.value);
    console.log(Reflect.getMetadata('swagger/apiResponse', descriptor.value));
    return descriptor;
  };
