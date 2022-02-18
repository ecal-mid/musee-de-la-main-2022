export class Path {
  constructor(params) {
    this.params = {
      server: "",
      address: "",
      post: "",
      protocol: "http://",
      local: import.meta.url,
      ...params,
    };
  }

  isHiddenFile(name) {
    return /(^|\/)\.[^\/\.]/g.test(name);
  }

  // TODO needs refactoring
  getAbsolutePath(...paths) {
    const fullPath = this.sanitize(paths);
    const { pathname } = new URL(`${fullPath}`, this.params.local);
    //* remove leading slash
    return this.sanitize(pathname);
}

  getRelativePath(...paths) {
    return this.sanitize(paths);
  }

  sanitize(paths) {
    if (typeof paths === "string") paths = [paths];

    const fullPath = paths
      .map((path) => String(path).replace(/^\/|\/$/g, ""))
      .filter(Boolean)
      .join("/");

    return fullPath;
  }

  getServerPath(...paths) {
    const { address, port, protocol } = this.params;
    const fullPath = this.sanitize(paths);

    return new URL(`${protocol}${address}:${port}/${fullPath}`);
  }
}
