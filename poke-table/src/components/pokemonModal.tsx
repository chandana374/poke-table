/* eslint-disable @next/next/no-img-element */
/* src/components/PokemonModal.tsx */
import React from "react";
import { PokemonDetails } from "../../../types/pokemon";

interface Props {
  pokemon: PokemonDetails;
  onClose: () => void;
}

const PokemonModal: React.FC<Props> = ({ pokemon, onClose }) => {
  return (
    /* backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      {/* dialog */}
      <div className="relative w-[90%] max-w-md rounded-2xl
                      bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
                      text-white shadow-2xl p-6 border-2 border-gray-700">
        {/* close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-4 text-yellow-400 hover:text-yellow-500
                     text-2xl font-bold leading-none transition"
        >
          ×
        </button>

        {/* name */}
        <h2 className="text-3xl font-extrabold text-yellow-400 capitalize mb-6 text-center drop-shadow">
          {pokemon.name}
        </h2>

        {/* sprite */}
        <div className="flex justify-center mb-8">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-32 h-32 drop-shadow-lg"
          />
        </div>

        {/* types */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-yellow-300 mb-2">Types</h3>
          <div className="flex flex-wrap gap-2">
            {pokemon.types.map((type: PokemonDetails["types"][number]) => (
              <span
                key={type.slot}
                className="bg-yellow-500 text-gray-900 font-semibold px-3 py-1 rounded-full shadow"
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </section>

        {/* stats */}
        <section className="mb-6">
          <h3 className="text-lg font-bold text-yellow-300 mb-2">Stats</h3>
          <ul className="space-y-1">
            {pokemon.stats.map((stat: PokemonDetails["stats"][number]) => (
              <li key={stat.stat.name}>
                <span className="capitalize">{stat.stat.name}</span>:{" "}
                <span className="font-bold text-yellow-400">
                  {stat.base_stat}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* abilities */}
        <section>
          <h3 className="text-lg font-bold text-yellow-300 mb-2">Abilities</h3>
          <ul className="space-y-1">
            {pokemon.abilities.map(
              (ability: PokemonDetails["abilities"][number]) => (
                <li key={ability.ability.name}>
                  {ability.ability.name}
                  {ability.is_hidden && (
                    <span className="ml-2 text-sm text-yellow-500">
                      (hidden)
                    </span>
                  )}
                </li>
              )
            )}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PokemonModal;
