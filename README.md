# bookstore-api
# Bookstore REST API

A simple REST API built with Node.js and Express that supports user authentication and book management using a file-based JSON store.

---

##  Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/vedhakavya/bookstore-api.git
cd bookstore-api
npm install
node index.js
Server will start at: http://localhost:3000
AUTENCIATION
| Method | Endpoint       | Description         |
| ------ | -------------- | ------------------- |
| POST   | /auth/register | Register a new user |
| POST   | /auth/login    | Login and get token |

BOOKS API
| Method | Endpoint    | Description           |
| ------ | ----------- | --------------------- |
| GET    | /books      | Get all books         |
| GET    | /books/\:id | Get a book by ID      |
| POST   | /books      | Add a new book (auth) |
| PUT    | /books/\:id | Update a book (auth)  |
| DELETE | /books/\:id | Delete a book (auth)  |

How to Test (Postman / curl)
✅ Register
 POST /auth/register
{
  "username": "testuser",
  "password": "123456"
}
✅ Login
POST /auth/login
Returns:
{
  "token": "your-jwt-token"
}
✅ Get Books (With Token)
"Authorization: Bearer your-token" http://localhost:3000/books

Optional: Swagger Docs
If implemented, open:
http://localhost:3000/api-docs



Made by Vedha Kavya
