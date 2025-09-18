import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


const app = express();
const port = 3000;

// PostgreSQL setup
const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// Home page - list books
app.get("/", async (req, res) => {
  const sortBy = req.query.sort || "date_added"; // default sorting
  const validSorts = {
    title: "title ASC",
    year: "year DESC",
    date_added: "date_added DESC"
  };

  const sortOrder = validSorts[sortBy] || "date_added DESC";

  try {
    const result = await db.query(`SELECT * FROM books ORDER BY ${sortOrder}`);
    res.render("index.ejs", { books: result.rows, currentSort: sortBy });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading books");
  }
});


// Add new book page
app.get("/add", (req, res) => {
  res.render("add.ejs");
});

// Add new book POST
app.post("/add", async (req, res) => {
  const { title, author, year, rating, review } = req.body;

  try {
    const response = await axios.get(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`);
    const cover_id = response.data.docs[0]?.cover_i || null;
    await db.query(
      "INSERT INTO books (title, author, year, rating, review, cover_id) VALUES ($1, $2, $3, $4, $5, $6)",
      [title, author, year, rating, review, cover_id]
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding book");
  }
});

// Edit book page
app.get("/edit/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [req.params.id]);
    res.render("edit.ejs", { book: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading book");
  }
});

// Update book POST
app.post("/edit/:id", async (req, res) => {
  const { rating, review } = req.body;
  try {
    await db.query("UPDATE books SET rating = $1, review = $2 WHERE id = $3", [rating, review, req.params.id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating book");
  }
});

// Delete book
app.post("/delete/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id = $1", [req.params.id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting book");
  }
});









app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
