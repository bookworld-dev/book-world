import { Book, BookRequest, Location, LocationRequest } from "../lib/types";

export const exampleBookReq: BookRequest = {
  author: 'Jack Kerouac',
  title: 'Big Sur',
  coverUrl: 'coverArt_1.jpeg'
}

export const exampleBook: Book = {
  id: "example-uuid-1",
  ... exampleBookReq
}

export const exampleBookReq2: BookRequest = {
  author: 'Ernest Hemingway',
  title: 'The Sun Also Rises',
  coverUrl: 'coverArt_2.jpeg'
}

export const exampleCountryReq: LocationRequest = {
  level: 'country',
  code: 'US',
  name: 'United States of America',
  parentId: null
}

export const exampleCountryReq2: LocationRequest = {
  level: 'country',
  code: 'ES',
  name: 'Spain',
  parentId: null
}

export const exampleCountry: Location = {
  id: "example-uuid-2",
  ... exampleCountryReq
}

export const exampleStateReq: LocationRequest = {
  level: 'state',
  code: 'US-CA',
  name: 'California',
  parentId: null
}

export const exampleState: Location = {
  id: "example-uuid-3",
  ... exampleStateReq
}