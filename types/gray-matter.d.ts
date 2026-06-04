declare module "gray-matter" {
  interface GrayMatterFile<T = Record<string, unknown>> {
    data: T;
    content: string;
    excerpt?: string;
    orig: Buffer | string;
    language: string;
    matter: string;
    stringify(): string;
  }

  function matter<T = Record<string, unknown>>(
    input: string | Buffer,
    options?: { excerpt?: boolean }
  ): GrayMatterFile<T>;

  export = matter;
}
