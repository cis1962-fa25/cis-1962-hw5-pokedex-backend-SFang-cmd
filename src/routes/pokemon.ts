import express, { Request, Response } from 'express';
import { getPokemonByName, getAllPokemon } from '../services/pokemonServices';

const router = express.Router();

// route to get a Pokemon by name
router.get('/:name', async (req: Request, res: Response) => {
  const { name } = req.params;
  try {
    const pokemon = await getPokemonByName(name);
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(404).json({
      code: 'NOT_FOUND',
      message: 'Pokémon not found'
    });
  }
});

// route to list all pokemon with pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string);
    const offset = parseInt(req.query.offset as string);

    if (isNaN(offset) || isNaN(limit) || offset < 0 || limit < 1) {
      return res.status(400).json({
        code: 'INVALID_QUERY',
        message: 'Offset must be non-negative and limit must be positive, valid integers'
      });
    }
    
    const pokemon = await getAllPokemon(limit, offset);
    res.status(200).json(pokemon);
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    });
  }
});

export default router;