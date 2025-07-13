/* src/components/PokemonTable.tsx */
/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pokemon, PokemonDetails } from "../../../types/pokemon";
import PokemonModal from "./pokemonModal";

interface Props {
  pokemonList: Pokemon[];
  currentPage: number;
  searchName: string;
}

const PokemonTable: React.FC<Props> = ({
  pokemonList,
  currentPage,
  searchName,
}) => {
  /* ------------------------------------------------------------------ */
  /* STATE & ROUTER */
  /* ------------------------------------------------------------------ */
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchName);
  const [selectedPokemon, setSelectedPokemon] =
    useState<PokemonDetails | null>(null);

  /* ------------------------------------------------------------------ */
  /* FETCH DETAILS (client‑side) */
  /* ------------------------------------------------------------------ */
  const fetchPokemonDetails = async (name: string) => {
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`
      );
      if (!res.ok) throw new Error("not found");
      setSelectedPokemon(await res.json());
    } catch {
      alert("Failed to fetch Poeémon details.");
    }
  };

  /* ------------------------------------------------------------------ */
  /* TABLE SETUP (TanStack) */
  /* ------------------------------------------------------------------ */
  const columns = useMemo<ColumnDef<Pokemon>[]>(
    () => [
      {
        id: "sprite",
        header: "Sprite",
        cell: ({ row }) => (
          <div className="flex justify-center">
            <img
              src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${row.original.name}.gif`}
              alt={row.original.name}
              className="w-12 h-12 drop-shadow-lg"
              loading="lazy"
            />
          </div>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue }) => (
          <span className="capitalize text-xl text-yellow-300 font-bold">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: "action",
        header: "",
        cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              fetchPokemonDetails(row.original.name);
            }}
            aria-label={`View details of ${row.original.name}`}
            className="text-yellow-400 hover:text-yellow-500 transition transform hover:scale-125 active:scale-95"
          >
            →
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: pokemonList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /* ------------------------------------------------------------------ */
  /* HANDLERS: pagination & search */
  /* ------------------------------------------------------------------ */
  const pushQuery = (params: URLSearchParams) =>
    router.push(`/?${params.toString()}`);

  const handlePagination = (newPage: number) => {
    if (newPage < 1) return;
    const params = new URLSearchParams();
    params.set("page", newPage.toString());
    if (searchInput.trim()) params.set("name", searchInput.trim());
    pushQuery(params);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("name", searchInput.trim());
    else params.set("page", "1");
    pushQuery(params);
  };

  /* ------------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------------ */
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-4 mb-8">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search Pokemon by name..."
          className="flex-1 rounded-full border-2 border-gray-700 bg-gray-800 px-5 py-3 font-bold text-lg text-white placeholder-gray-500
                     focus:outline-none focus:ring-4 focus:ring-yellow-500 transition shadow-sm"
        />
        <button
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-extrabold text-lg px-6 py-3 rounded-full shadow-lg
                     transition transform hover:scale-105 active:scale-95"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border-2 border-gray-700 bg-gray-800 shadow-lg">
        <table className="min-w-full text-white font-semibold">
          <thead className="bg-gray-700 text-yellow-400 uppercase tracking-wider font-extrabold text-lg">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-6 py-4">
                    {h.isPlaceholder
                      ? null
                      : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center py-10 italic text-gray-400 text-lg"
                >
                  No Pokemon found
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => fetchPokemonDetails(row.original.name)}
                className="cursor-pointer transition hover:bg-gray-700 hover:shadow-lg active:scale-95"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (hidden during name search) */}
      {!searchName && (
        <div className="flex justify-between mt-8">
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-8 py-3 font-extrabold text-yellow-400 shadow-md
                       transition transform hover:scale-105 active:scale-95"
          >
            ← Previous
          </button>
          <button
            onClick={() => handlePagination(currentPage + 1)}
            className="bg-gray-700 hover:bg-gray-600 rounded-full px-8 py-3 font-extrabold text-yellow-400 shadow-md
                       transition transform hover:scale-105 active:scale-95"
          >
            Next →
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
};

export default PokemonTable;
