import { test, expect } from '@playwright/test';

test.describe('Library API', () => {

    test.describe.configure({ mode: 'serial' });

    let createdBookId: number;

    // ─── GET ────────────────────────────────────────────────────────────────────

    test('GET - retrieve all books', async ({ request }) => {
        const res = await request.get('/api/books');
        expect(res.status()).toBe(200);
        const books = await res.json();
        expect(Array.isArray(books)).toBeTruthy();
        expect(books.length).toBe(3);
    });

    test('GET - retrieve a book by valid ID', async ({ request }) => {
        const res = await request.get('/api/books/1');
        expect(res.status()).toBe(200);
        const book = await res.json();
        expect(book.id).toBe(1);
        expect(book.title).toBe('The Great Gatsby');
        expect(book.borrower).toBe('Alice Smith');
    });

    test('GET - return 404 for non-existent book', async ({ request }) => {
        const res = await request.get('/api/books/9999');
        expect(res.status()).toBe(404);
        const body = await res.json();
        expect(body.error).toContain('not found');
    });

    test('GET - returned book has correct status', async ({ request }) => {
        const res = await request.get('/api/books/3');
        expect(res.status()).toBe(200);
        const book = await res.json();
        expect(book.returned).toBe(true);
    });

    // ─── POST ───────────────────────────────────────────────────────────────────

    test('POST - add a new book', async ({ request }) => {
        const res = await request.post('/api/books', {
            data: {
                title: 'Brave New World',
                author: 'Aldous Huxley',
                borrower: 'Dave Brown',
                dueDate: '2026-08-01',
            },
        });
        expect(res.status()).toBe(201);
        const book = await res.json();
        expect(book.id).toBeDefined();
        expect(book.title).toBe('Brave New World');
        expect(book.returned).toBe(false);
        createdBookId = book.id;
    });

    test('POST - fail with missing required fields', async ({ request }) => {
        const res = await request.post('/api/books', {
            data: { title: 'Incomplete Book' },
        });
        expect(res.status()).toBe(400);
        const body = await res.json();
        expect(body.error).toBeDefined();
    });

    test('POST - new book appears in full list', async ({ request }) => {
        const res = await request.get('/api/books');
        const books = await res.json();
        const found = books.find((b: { id: number }) => b.id === createdBookId);
        expect(found).toBeDefined();
        expect(found.title).toBe('Brave New World');
    });

    test('POST - book count increased after creation', async ({ request }) => {
        const res = await request.get('/api/books');
        const books = await res.json();
        expect(books.length).toBe(4);
    });

    // ─── PUT ────────────────────────────────────────────────────────────────────

    test('PUT - update borrower of created book', async ({ request }) => {
        const res = await request.put(`/api/books/${createdBookId}`, {
            data: { borrower: 'Eve Davis', dueDate: '2026-09-01' },
        });
        expect(res.status()).toBe(200);
        const book = await res.json();
        expect(book.borrower).toBe('Eve Davis');
        expect(book.dueDate).toBe('2026-09-01');
    });

    test('PUT - mark book as returned', async ({ request }) => {
        const res = await request.put(`/api/books/${createdBookId}`, {
            data: { returned: true },
        });
        expect(res.status()).toBe(200);
        const book = await res.json();
        expect(book.returned).toBe(true);
    });

    test('PUT - verify updated data persists on GET', async ({ request }) => {
        const res = await request.get(`/api/books/${createdBookId}`);
        const book = await res.json();
        expect(book.borrower).toBe('Eve Davis');
        expect(book.returned).toBe(true);
    });

    test('PUT - return 404 for non-existent book', async ({ request }) => {
        const res = await request.put('/api/books/9999', {
            data: { borrower: 'Ghost' },
        });
        expect(res.status()).toBe(404);
    });

    // ─── DELETE ─────────────────────────────────────────────────────────────────

    test('DELETE - delete the created book', async ({ request }) => {
        const res = await request.delete(`/api/books/${createdBookId}`);
        expect(res.status()).toBe(204);
    });

    test('DELETE - return 404 for already deleted book', async ({ request }) => {
        const res = await request.delete(`/api/books/${createdBookId}`);
        expect(res.status()).toBe(404);
    });

    test('DELETE - deleted book no longer retrievable by ID', async ({ request }) => {
        const res = await request.get(`/api/books/${createdBookId}`);
        expect(res.status()).toBe(404);
    });

    test('DELETE - other books are unaffected', async ({ request }) => {
        const res = await request.get('/api/books');
        const books = await res.json();
        expect(books.length).toBe(3);
        expect(books.find((b: { id: number }) => b.id === 1)).toBeDefined();
        expect(books.find((b: { id: number }) => b.id === 2)).toBeDefined();
        expect(books.find((b: { id: number }) => b.id === 3)).toBeDefined();
    });

});
