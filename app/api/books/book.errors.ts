export class BookNotFoundError extends Error {
  constructor(message = 'No book found') {
    super(message);
    this.name = 'BookNotFoundError';
  }
}