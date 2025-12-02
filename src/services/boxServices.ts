import { BoxEntry, InsertBoxEntry, UpdateBoxEntry } from '../types/Box';
import { InsertBoxEntrySchema, UpdateBoxEntrySchema } from '../schemas';
import redisClient from '../redisClient';
import { createId } from '@paralleldrive/cuid2';

export async function createBoxEntry(pennkey: string, data: InsertBoxEntry): Promise<BoxEntry> {
  const validated = InsertBoxEntrySchema.parse(data);
  const id = createId();

  const entry: BoxEntry = {
    id,
    createdAt: validated.createdAt,
    level: validated.level,
    location: validated.location,
    notes: validated.notes,
    pokemonId: validated.pokemonId,
  };

  const key = `${pennkey}:pokedex:${id}`;
  await redisClient.set(key, JSON.stringify(entry));

  return entry;
}

export async function getBoxEntry(pennkey: string, id: string): Promise<BoxEntry | null> {
  const key = `${pennkey}:pokedex:${id}`;
  const data = await redisClient.get(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data) as BoxEntry;
}

export async function listBoxEntries(pennkey: string): Promise<string[]> {
  const pattern = `${pennkey}:pokedex:*`;
  const keys = await redisClient.keys(pattern);

  const ids = keys.map(key => key.split(':').pop() || '');
  return ids.filter(id => id.length > 0);
}

export async function updateBoxEntry(pennkey: string, id: string, data: UpdateBoxEntry): Promise<BoxEntry> {
  const key = `${pennkey}:pokedex:${id}`;
  const existing = await redisClient.get(key);

  if (!existing) {
    throw new Error('Entry not found');
  }

  const entry = JSON.parse(existing) as BoxEntry;
  const validated = UpdateBoxEntrySchema.parse(data);

  const updated: BoxEntry = {
    ...entry,
    ...validated,
  };

  await redisClient.set(key, JSON.stringify(updated));

  return updated;
}

export async function deleteBoxEntry(pennkey: string, id: string): Promise<void> {
  const key = `${pennkey}:pokedex:${id}`;
  await redisClient.del(key);
}

export async function clearBoxEntries(pennkey: string): Promise<void> {
  const pattern = `${pennkey}:pokedex:*`;
  const keys = await redisClient.keys(pattern);

  if (keys.length > 0) {
    await Promise.all(keys.map(key => redisClient.del(key)));
  }
}
