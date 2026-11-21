declare module 'mapshaper' {
  const mapshaper: {
    applyCommands(commands: string, input: Record<string, unknown>): Promise<Record<string, Buffer>>;
  };
  export default mapshaper;
}
