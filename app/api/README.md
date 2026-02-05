**POST** `/api/books`

Creates a book.

- Body: `multipart/form-data`
  - `title` (string)
  - `author` (string)
  - `cover` (file, jpg/png)

- Status `201`
- Response body `application/json`
  - `id` (string)
  - `title` (string)
  - `author` (string)
  - `coverUrl` (string)

---

**GET** `/api/books/[bookId]`

Gets a book by ID.

- Path params:
  - `bookId` (string)

- Status `200`
- Response body `application/json`
  - `id` (string)
  - `title` (string)
  - `author` (string)
  - `coverUrl` (string)

---

**DELETE** `/api/books/[bookId]`

Deletes a book by ID.

- Path params:
  - `bookId` (string)

- Status `204`

---

**GET** `/api/books/random`

Gets a random book for a given location. E.g. `location=US` for random book from USA or `location=US-CA` for random book from California.

- Query params:
  - `location`

- Status `200`
- Response body `application/json`
  - `id` (string)
  - `title` (string)
  - `author` (string)
  - `coverUrl` (string)

---

**GET** `/api/locations`

Gets all (populated) locations. If `populated=true` is passed as query parameter, only locations with books associated are returned.

- Query params:
  - `populated`

- Status `200`
- Response body `application/json`
  - []
    - `id` (string)
    - `title` (string)
    - `author` (string)
    - `coverUrl` (string)

---

**GET** `/api/books/[bookId]/locations`

Gets all locations for given book

- Path params:
  - `bookId` (string)

- Status `200`
- Response body `application/json`
  - []
    - `id` (string)
    - `level` (string)
    - `code` (string)
    - `name` (string)
    - `parentId` (string)

---

**POST** `/api/books/[bookId]/locations`

Associates a location with a book.

- Path params:
  - `bookId` (string)

- Body: `application/json`
  - `locationId` (string)

- Status `201`
- Response body `application/json`
  - `bookId` (string)
  - `locationId` (string)

---

**GET** `/api/locations/[locationId]/books`

Gets all books for given location

- Path params:
  - `locationId` (string)

- Status `200`
- Response body `application/json`
  - []
    - `id` (string)
    - `title` (string)
    - `author` (string)
    - `coverUrl` (string)