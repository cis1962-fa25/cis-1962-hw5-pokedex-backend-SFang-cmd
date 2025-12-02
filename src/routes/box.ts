import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createBoxEntry,
  getBoxEntry,
  listBoxEntries,
  updateBoxEntry,
  deleteBoxEntry,
  clearBoxEntries,
} from '../services/boxServices';
import { InsertBoxEntrySchema, UpdateBoxEntrySchema } from '../schemas';
import { ZodError } from 'zod';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// List all box entry IDs for authenticated user
router.get('/', async (req: Request, res: Response) => {
  try {
    const pennkey = (req as any).user.pennkey;
    const ids = await listBoxEntries(pennkey);
    res.status(200).json(ids);
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
});

// Create a new box entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const pennkey = (req as any).user.pennkey;
    const validated = InsertBoxEntrySchema.parse(req.body);
    const entry = await createBoxEntry(pennkey, validated);
    res.status(201).json(entry);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        code: 'BAD_REQUEST',
        message: 'Invalid request body',
      });
    }
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
});

// Get a specific box entry
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const pennkey = (req as any).user.pennkey;
    const { id } = req.params;
    const entry = await getBoxEntry(pennkey, id);

    if (!entry) {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Box entry not found',
      });
    }

    res.status(200).json(entry);
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
});

// Update a box entry
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const pennkey = (req as any).user.pennkey;
    const { id } = req.params;

    try {
      const validated = UpdateBoxEntrySchema.parse(req.body);
      const entry = await updateBoxEntry(pennkey, id, validated);
      res.status(200).json(entry);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 'BAD_REQUEST',
          message: 'Invalid request body',
        });
      }
      throw error;
    }
  } catch (error: any) {
    if (error.message === 'Entry not found') {
      return res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Box entry not found',
      });
    }
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
});

// Delete a specific box entry
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const pennkey = (req as any).user.pennkey;
    const { id } = req.params;
    await deleteBoxEntry(pennkey, id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
});

// Clear all box entries for authenticated user
router.delete('/', async (req: Request, res: Response) => {
  try {
    const pennkey = (req as any).user.pennkey;
    await clearBoxEntries(pennkey);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
});

export default router;
