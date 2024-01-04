import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as BookService from './book.service';

export const bookRouter = express.Router();

bookRouter.get('/', async (_: Request, response: Response) => {
  try {
    const books = await BookService.listBooks();
    return response.status(200).json({ data: books });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

bookRouter.get('/:id', async (request: Request, response: Response) => {
  try {
    const id: number = parseInt(request.params.id, 10);

    const book = await BookService.getBook(id);

    if (!book)
      return response.status(404).json({ message: 'Book Could not be Found.' });

    return response.status(200).json({ data: book });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

bookRouter.post(
  '/',
  body('title').isString(),
  body('datePublished').isDate().toDate(),
  body('isFiction').isBoolean(),
  body('authorId').isInt(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array() });
    }

    try {
      const book = request.body;
      const newBook = await BookService.createBook(book);
      return response.status(201).json({ data: newBook });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

bookRouter.put(
  '/:id',
  body('title').isString(),
  body('datePublished').isDate().toDate(),
  body('isFiction').isBoolean(),
  body('authorId').isInt(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array() });
    }

    try {
      const book = request.body;
      const id: number = parseInt(request.params.id, 10);

      const updatedBook = await BookService.updateBook(book, id);
      return response.status(200).json({ data: updatedBook });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

bookRouter.delete('/:id', async (request: Request, response: Response) => {
  try {
    const id: number = parseInt(request.params.id, 10);

    await BookService.deleteBook(id);
    return response
      .status(204)
      .json({ message: 'Book deleted successfully.' });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
