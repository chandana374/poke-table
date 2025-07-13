/* src/components/EvolutionTriggerTable.tsx */
"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { EvolutionTrigger } from "../../../types/pokemon";

interface Props {
  triggers: EvolutionTrigger[];
  currentPage: number; // page for this table (query param: evoPage)
}

export default function EvolutionTriggerTable({
  triggers,
  currentPage,
}: Props) {
  /* -------------------------------------------------- */
  /* TanStack setup                                     */
  /* -------------------------------------------------- */
  const columns = useMemo<ColumnDef<EvolutionTrigger>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Evolution Trigger",
        cell: ({ getValue }) => (
          <span className="capitalize text-lg text-yellow-300 font-bold">
            {getValue<string>()}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: triggers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /* -------------------------------------------------- */
  /* Pagination handlers (updates ?evoPage=)            */
  /* -------------------------------------------------- */
  const router = useRouter();
  const handlePagination = (newPage: number) => {
    if (newPage < 1) return;
    const params = new URLSearchParams(window.location.search);
    params.set("evoPage", newPage.toString());
    router.push(`/?${params.toString()}`);
  };

  /* -------------------------------------------------- */
  /* Render                                             */
  /* -------------------------------------------------- */
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-extrabold text-yellow-400 mb-4 text-center drop-shadow">
        Evolution Triggers
      </h2>

      <div className="rounded-xl border-2 border-gray-700 bg-gray-800 shadow-lg overflow-hidden">
        <table className="min-w-full text-white font-semibold">
          <thead className="bg-gray-700 text-yellow-400 uppercase tracking-wider font-extrabold">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-6 py-4 text-left">
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
                  colSpan={1}
                  className="text-center py-8 italic text-gray-400"
                >
                  No triggers found
                </td>
              </tr>
            )}

            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-700 hover:bg-gray-700"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePagination(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-8 py-2 font-bold text-yellow-400 shadow-md transition"
        >
          ← Previous
        </button>

        <button
          onClick={() => handlePagination(currentPage + 1)}
          className="bg-gray-700 hover:bg-gray-600 rounded-full px-8 py-2 font-bold text-yellow-400 shadow-md transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
