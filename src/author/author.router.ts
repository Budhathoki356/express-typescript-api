import express from 'express';
import type { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import * as AuthorService from './author.service';

export const authorRouter = express.Router();

authorRouter.get('/', async (_: Request, response: Response) => {
  try {
    const authors = await AuthorService.listAuthor();
    return response.status(200).json({ data: authors });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

authorRouter.get('/:id', async (request: Request, response: Response) => {
  try {
    const id:number = parseInt(request.params.id, 10);

    const author = await AuthorService.getAuthor(id);

    if (!author)
      return response
        .status(404)
        .json({ message: 'Author Could not be Found.' });

    return response.status(200).json({ data: author });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});

authorRouter.post(
  '/',
  body('firstName').isString(),
  body('lastName').isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array() });
    }

    try {
      const author = request.body;
      const newAuthor = await AuthorService.createAuthor(author);
      return response.status(201).json({ data: newAuthor });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

authorRouter.put(
  '/:id',
  body('firstName').isString(),
  body('lastName').isString(),
  async (request: Request, response: Response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(400).json({ message: errors.array() });
    }

    try {
      const author = request.body;
      const id:number = parseInt(request.params.id, 10);

      const updatedAuthor = await AuthorService.updateAuthor(author, id);
      return response.status(200).json({ data: updatedAuthor });
    } catch (error: any) {
      return response.status(500).json(error.message);
    }
  }
);

authorRouter.delete('/:id', async (request: Request, response: Response) => {
  try {
    const id: number = parseInt(request.params.id, 10);

    await AuthorService.deleteAuthor(id);
    return response
      .status(204)
      .json({ message: 'Author deleted successfully.' });
  } catch (error: any) {
    return response.status(500).json(error.message);
  }
});
