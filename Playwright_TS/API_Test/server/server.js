const express = require('express');
const app = express();
app.use(express.json());

let books = [
  { id: 1, title: 'The Great Gatsby',        author: 'F. Scott Fitzgerald', borrower: 'Alice Smith',  dueDate: '2026-07-15', returned: false },
  { id: 2, title: '1984',                    author: 'George Orwell',        borrower: 'Bob Jones',    dueDate: '2026-07-20', returned: false },
  { id: 3, title: 'To Kill a Mockingbird',   author: 'Harper Lee',           borrower: 'Carol White',  dueDate: '2026-06-30', returned: true  },
];

let nextId = 4;

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const book = books.find(b => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ error: 'Book not found' });
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author, borrower, dueDate } = req.body;
  if (!title || !author || !borrower || !dueDate) {
    return res.status(400).json({ error: 'Missing required fields: title, author, borrower, dueDate' });
  }
  const newBook = { id: nextId++, title, author, borrower, dueDate, returned: false };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  books[idx] = { ...books[idx], ...req.body };
  res.json(books[idx]);
});

app.delete('/api/books/:id', (req, res) => {
  const idx = books.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Book not found' });
  books.splice(idx, 1);
  res.status(204).send();
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Library API running on http://localhost:${PORT}`));
