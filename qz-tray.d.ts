declare module "qz-tray" {
  const qz: {
    websocket: {
      connect: () => Promise<void>;
      disconnect: () => Promise<void>;
      isActive: () => boolean;
    };
    configs: {
      create: (printer: string) => unknown;
    };
    print: (config: unknown, data: unknown[]) => Promise<void>;
  };
  export default qz;
}