import { Book, Location } from "../lib/types";

export const exampleBook: Book = {
  id: '1',
  author: 'Albert Camus',
  title: 'Summer in Algiers',
  country: 'Algeria',
  coverUrl: 'coverArt_1.jpeg'
}

export const exampleCountry: Location = {
  id: '1',
  level: 'country',
  code: 'US',
  name: 'United States of America',
  parentId: null
}

export const exampleState: Location = {
  id: '2',
  level: 'state',
  code: 'US-CA',
  name: 'California',
  parentId: '1'
}