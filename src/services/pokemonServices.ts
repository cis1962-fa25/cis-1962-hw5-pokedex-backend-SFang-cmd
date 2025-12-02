import { Pokemon, PokemonMove, PokemonType } from '../types/Pokemon';
import Pokedex from 'pokedex-promise-v2';

const p = new Pokedex();

const TYPE_COLORS: Record<string, string> = {
  normal: '#a8a878',
  fire: '#f08030',
  water: '#6890f0',
  grass: '#78c850',
  electric: '#f8d030',
  ice: '#98d8d8',
  fighting: '#c03028',
  poison: '#a040a0',
  ground: '#e0c068',
  flying: '#a890f0',
  psychic: '#f85888',
  bug: '#a8b820',
  rock: '#b8a038',
  ghost: '#705898',
  dragon: '#7038f8',
  dark: '#705848',
  steel: '#b8b8d0',
  fairy: '#ee99ac',
};

export async function getPokemonByName(name: string): Promise<Pokemon> {
  console.log(`Fetching data for Pokémon: ${name}`);
  // extract every piece of pokemon information for the final Pokemon object
  // uses the pokedex-promise-v2 library
  // side note: i hate their types library. why is everything in the same file...
  // was way too hard to figure out what types were where...
  const pokemon = await p.getPokemonByName(name);
  const species = await p.getPokemonSpeciesByName(name);
  const id = pokemon.id;
  const englishName = species.names.filter((pokeAPIName: any) => pokeAPIName.language.name === 'en')[0].name;
  const description = species.flavor_text_entries.find((entry: any) => entry.language.name === 'en')?.flavor_text || '';
  const types: PokemonType[] = pokemon.types.map((t: any) => ({
    name: t.type.name.toUpperCase(),
    color: TYPE_COLORS[t.type.name] || '#ffffff',
  }));
  const moveNames = pokemon.moves.map((m: any) => m.move.name);
  const moves: PokemonMove[] = await Promise.all(
    moveNames.map(async (moveName: any) => {
      const moveData = await p.getMoveByName(moveName);
      const englishName = moveData.names.filter((pokeAPIName: any) => pokeAPIName.language.name === 'en')[0].name;
      return {
        name: englishName,
        power: moveData.power && moveData.power > 0 ? moveData.power : undefined,
        type: {
          name: moveData.type.name.toUpperCase(),
          color: TYPE_COLORS[moveData.type.name] || '#ffffff',
        },
      };
    })
  );
  const sprites = {
    front_default: pokemon.sprites.front_default || '',
    back_default: pokemon.sprites.back_default || '',
    front_shiny: pokemon.sprites.front_shiny || '',
    back_shiny: pokemon.sprites.back_shiny || '',
  };
  const stats = {
    hp: pokemon.stats.find((s: any) => s.stat.name === 'hp')?.base_stat || 0,
    speed: pokemon.stats.find((s: any) => s.stat.name === 'speed')?.base_stat || 0,
    attack: pokemon.stats.find((s: any) => s.stat.name === 'attack')?.base_stat || 0,
    defense: pokemon.stats.find((s: any) => s.stat.name === 'defense')?.base_stat || 0,
    specialAttack: pokemon.stats.find((s: any) => s.stat.name === 'special-attack')?.base_stat || 0,
    specialDefense: pokemon.stats.find((s: any) => s.stat.name === 'special-defense')?.base_stat || 0,
  };
  
  return {
    id: id,
    name: englishName,
    description: description,
    types: types,
    moves: moves,
    sprites: sprites,
    stats: stats
  };
}

export async function getAllPokemon(limit: number, offset: number): Promise<Pokemon[]> {
  const pokemonList = await p.getPokemonsList({ limit, offset });
  const pokemonPromises = pokemonList.results.map((pokemon: any) => getPokemonByName(pokemon.name));
  return Promise.all(pokemonPromises);
}