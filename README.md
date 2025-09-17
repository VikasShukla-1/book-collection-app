# 📚 Book Collection App  

A full-stack book management app built with **Node.js, Express, PostgreSQL, EJS, and OpenLibrary API**.  

## 🚀 Features
- Add new books with title, author, year, rating, and review  
- Fetch book covers via OpenLibrary API  
- Edit ratings and reviews  
- Delete books from collection  
- Sort by title, year, or date added  

## 🛠️ Tech Stack
- Node.js + Express.js  
- PostgreSQL  
- EJS Templating  
- Axios (API requests)  
- CSS (static assets)  

## ⚙️ Setup
1. Clone the repo  
   ```bash
   git clone https://github.com/yourusername/book-collection-app.git
   cd book-collection-app
Install dependencies

npm install

Create .env file (see .env.example)

Setup PostgreSQL database

CREATE DATABASE bookdb;

\c bookdb

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  year INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  cover_id INT,
  date_added TIMESTAMP DEFAULT NOW()
);


Run the app

node index.js

Open http://localhost:3000

