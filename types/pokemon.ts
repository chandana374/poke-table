// types/pokemon.ts
export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetails {
  name: string;
  sprites: {
    front_default: string;
  };
  types: {
    slot: number;
    type: { name: string };
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  abilities: {
    ability: { name: string };
    is_hidden: boolean;
  }[];
}
