export class GraphqlNetworkError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GraphqlNetworkError';
    this.status = status;
  }
}

export class GraphqlServerError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GraphqlServerError';
    this.status = status;
  }
}

export class GraphqlClientError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GraphqlClientError';
    this.status = status;
  }
}

export class GraphqlUnknownError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GraphqlUnknownError';
    this.status = status;
  }
}

export class GraphqlValidationError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GraphqlValidationError';
    this.status = status;
  }
}

export class GraphqlEmptyDataError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GraphqlEmptyDataError';
    this.status = status;
  }
}
