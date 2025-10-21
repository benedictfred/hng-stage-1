# String Analytics API

A RESTful API built with Node.js, Express, TypeScript, and MongoDB that performs advanced string analysis and provides natural language querying capabilities.

## 🚀 Features

- **String Storage & Analysis**: Store strings with automatic computation of:

  - Length
  - Palindrome detection
  - Unique character count
  - Word count
  - SHA-256 hash
  - Character frequency mapping

- **Flexible Querying**: Multiple ways to retrieve strings:

  - By exact value
  - By properties (palindrome, length range, word count)
  - Natural language queries (e.g., "palindromic strings longer than 5")

- **CRUD Operations**: Full create, read, and delete operations for string records

- **Type Safety**: Built with TypeScript for enhanced developer experience and code reliability

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd hng-stage-one
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hng
```

4. Start MongoDB:

```bash
# If using local MongoDB
mongod
```

## 🚦 Usage

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

The server will start at `http://localhost:5000`

## 📚 API Endpoints

### 1. Create a String

**POST** `/strings`

Store a new string and get its computed properties.

**Request Body:**

```json
{
  "value": "Hello World"
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "string": {
      "id": "sha256_hash_here",
      "value": "Hello World",
      "properties": {
        "length": 11,
        "is_palindrome": false,
        "unique_characters": 8,
        "word_count": 2,
        "sha256_hash": "sha256_hash_here",
        "character_frequency_map": {
          "H": 1,
          "e": 1,
          "l": 3,
          "o": 2,
          "W": 1,
          "r": 1,
          "d": 1
        }
      },
      "created_at": "2025-10-21T12:00:00.000Z"
    }
  }
}
```

### 2. Get String by Value

**GET** `/strings/:string_value`

Retrieve a specific string by its exact value.

**Example:**

```bash
GET /strings/Hello%20World
```

### 3. Query Strings by Properties

**GET** `/strings?[query_params]`

Filter strings using query parameters.

**Available Query Parameters:**

- `is_palindrome` (boolean): Filter palindromic strings
- `min_length` (number): Minimum string length
- `max_length` (number): Maximum string length
- `word_count` (number): Exact word count
- `contains_character` (string): Filter strings containing a specific character

**Examples:**

```bash
# Get all palindromic strings
GET /strings?is_palindrome=true

# Get strings with length between 5 and 10
GET /strings?min_length=5&max_length=10

# Get strings containing the letter 'a'
GET /strings?contains_character=a

# Get single-word strings
GET /strings?word_count=1
```

**Response:**

```json
{
  "data": [...],
  "count": 5,
  "filters_applied": {
    "is_palindrome": "true"
  }
}
```

### 4. Natural Language Query

**GET** `/strings/filter-by-natural-language?query=[natural_query]`

Query strings using natural language.

**Supported Patterns:**

- "palindromic" - Find palindromic strings
- "longer than N" - Find strings longer than N characters
- "single word" - Find single-word strings
- "containing the letter X" - Find strings containing letter X

**Examples:**

```bash
GET /strings/filter-by-natural-language?query=palindromic strings longer than 5

GET /strings/filter-by-natural-language?query=single word strings containing the letter a
```

**Response:**

```json
{
  "data": [...],
  "count": 3,
  "interpreted_query": {
    "original": "palindromic strings longer than 5",
    "parsed_filters": {
      "properties.is_palindrome": true,
      "properties.length": { "$gte": 6 }
    }
  }
}
```

### 5. Delete a String

**DELETE** `/strings/:string_value`

Delete a string by its exact value.

**Example:**

```bash
DELETE /strings/Hello%20World
```

**Response:**

```
Status: 204 No Content
```

## 🏗️ Project Structure

```
src/
├── config/
│   └── db.ts                 # Database configuration
├── controllers/
│   └── string.controller.ts  # Request handlers
├── middlewares/
│   └── error.middleware.ts   # Global error handling
├── models/
│   └── string.model.ts       # Mongoose schema
├── routes/
│   └── string.routes.ts      # API routes
├── utils/
│   ├── app-error.ts          # Custom error class
│   ├── catch-async.ts        # Async error wrapper
│   └── nlpParser.ts          # Natural language parser
└── index.ts                  # Application entry point
```

## 🧪 Example Usage

```bash
# Create a palindrome
curl -X POST http://localhost:5000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'

# Get all palindromes
curl http://localhost:5000/strings?is_palindrome=true

# Natural language query
curl "http://localhost:5000/strings/filter-by-natural-language?query=palindromic%20strings"

# Get specific string
curl http://localhost:5000/strings/racecar

# Delete a string
curl -X DELETE http://localhost:5000/strings/racecar
```

## 🔧 Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Crypto** - SHA-256 hashing

## 📝 Error Handling

The API uses a centralized error handling middleware that returns consistent error responses:

```json
{
  "status": "error",
  "message": "Error description",
  "statusCode": 400
}
```

## 👤 Author

**Nebolisa Ugochukwu**

## 🔗 Related Resources

- [HNG Internship](https://hng.tech/internship)
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)

---

Built with ❤️ for the HNG Internship Stage One Project
