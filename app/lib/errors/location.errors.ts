export class LocationNotFoundError extends Error {
  constructor(message = 'No location found') {
    super(message);
    this.name = 'LocationNotFoundError';
  }
}