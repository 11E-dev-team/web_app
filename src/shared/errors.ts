export class IncorrectCanvasObjectError extends Error {
  constructor() {
    super("Incorrect canvas object");
  };
}

export class IncorrectShapeError extends Error {
  constructor(shape: string) {
    super("Incorrect shape " + shape);
  };
};

export class IncorrectToolError extends Error {
  constructor(tool: string) {
    super("Incorrect tool " + tool);
  };
};
