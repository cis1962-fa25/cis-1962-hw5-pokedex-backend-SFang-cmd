import Pokedex from 'pokedex-promise-v2';

const p = new Pokedex();

async function testPokedexFunctions() {
  console.log('='.repeat(80));
  console.log('Testing pokedex-promise-v2 getPokemonBy____ functions');
  console.log('='.repeat(80));

  try {
    // Test getPokemonByName
    console.log('\n1. getPokemonByName("pikachu")');
    console.log('-'.repeat(80));
    const byName = await p.getPokemonByName('pikachu');
    console.log(JSON.stringify(byName, null, 2));

    // Test getPokemonSpeciesByName
    console.log('\n3. getPokemonSpeciesByName("pikachu")');
    console.log('-'.repeat(80));
    const speciesByName = await p.getPokemonSpeciesByName('pikachu');
    console.log(JSON.stringify(speciesByName, null, 2));

  } catch (error) {
    console.error('Error during testing:', error);
  }
}

testPokedexFunctions();
