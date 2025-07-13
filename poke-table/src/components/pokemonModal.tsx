/* src/components/PokemonModal.tsx */
import React from "react";
import { PokemonDetails } from "../../../types/pokemon";

interface Props {
  pokemon: PokemonDetails;
  onClose: () => void;
}

const PokemonModal: React.FC<Props> = ({ pokemon, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative text-gray-900">
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-3 right-4 text-2xl font-bold text-gray-500 hover:text-black"
      >
        ×
      </button>

      {/* Name */}
      <h2 className="text-2xl font-bold capitalize mb-4 text-center">
        {pokemon.name}
      </h2>

      {/* Sprite */}
      <div className="flex justify-center mb-4">
        <img
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          className="w-24 h-24"
        />
      </div>

      {/* Types */}
      <section className="mb-4">
        <h3 className="font-semibold text-lg">Types:</h3>
        <div className="flex gap-2 mt-1">
          {pokemon.types.map((type: PokemonDetails["types"][number]) => (
            <span
              key={type.slot}
              className="bg-yellow-300 text-black px-3 py-1 rounded-full text-sm"
            >
              {type.type.name}
            </span>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-4">
        <h3 className="font-semibold text-lg">Stats:</h3>
        <ul className="mt-1">
          {pokemon.stats.map((stat: PokemonDetails["stats"][number]) => (
            <li key={stat.stat.name}>
              <strong className="capitalize">{stat.stat.name}</strong>:{" "}
              {stat.base_stat}
            </li>
          ))}
        </ul>
      </section>

      {/* Abilities */}
      <section>
        <h3 className="font-semibold text-lg">Abilities:</h3>
        <ul className="mt-1">
          {pokemon.abilities.map(
            (ability: PokemonDetails["abilities"][number]) => (
              <li key={ability.ability.name}>
                {ability.ability.name}
                {ability.is_hidden && (
                  <span className="ml-2 text-sm text-gray-500">(hidden)</span>
                )}
              </li>
            )
          )}
        </ul>
      </section>
    </div>
  </div>
);

export default PokemonModal;
