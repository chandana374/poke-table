// src/pages/index.tsx
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import PokemonTable from "../components/pokrmonTable"
import EvolutionTriggerTable from "../components/EvolutionTable";
import type { Pokemon, EvolutionTrigger } from "../../../types/pokemon";

interface PageProps {
  pokemonList: Pokemon[];
  currentPage: number;
  searchName: string;
  evolutionTriggers: EvolutionTrigger[];
  evoPage: number;
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                             */
/* -------------------------------------------------------------------------- */
export default function Home({
  pokemonList,
  currentPage,
  searchName,
  evolutionTriggers,
  evoPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="p-6 space-y-12">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-4">
        Pokemon SSR Demo
      </h1>

      <PokemonTable
        pokemonList={pokemonList}
        currentPage={currentPage}
        searchName={searchName}
      />

      <EvolutionTriggerTable
        triggers={evolutionTriggers}
        currentPage={evoPage}
      />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  getServerSideProps – runs on EVERY request                                 */
/* -------------------------------------------------------------------------- */
export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  /* ── read query params ──────────────────────────────────────────────── */
  const page     = Array.isArray(query.page)    ? query.page[0]    : query.page;
  const evoPage  = Array.isArray(query.evoPage) ? query.evoPage[0] : query.evoPage;
  const name     = Array.isArray(query.name)    ? query.name[0]    : query.name;

  const currentPage = Math.max(parseInt(page ?? "1", 10), 1);
  const currentEvo  = Math.max(parseInt(evoPage ?? "1", 10), 1);
  const searchName  = (name ?? "").trim().toLowerCase();

  let pokemonList: Pokemon[] = [];
  try {
    if (searchName) {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(searchName)}`
      );
      if (res.ok) {
        const data = await res.json();
        pokemonList = [{ name: data.name, url: data.species.url }];
      }
    } else {
      const limit = 20;
      const offset = (currentPage - 1) * limit;
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();
      pokemonList = data.results;
    }
  } catch {
    pokemonList = [];
  }

  /* ── fetch evolution triggers (5 per page) ──────────────────────────── */
  let evolutionTriggers: EvolutionTrigger[] = [];
  try {
    const evoLimit  = 5;
    const evoOffset = (currentEvo - 1) * evoLimit;
    const res = await fetch(
      `https://pokeapi.co/api/v2/evolution-trigger/?limit=${evoLimit}&offset=${evoOffset}`
    );
    const data = await res.json();
    evolutionTriggers = data.results;
  } catch {
    evolutionTriggers = [];
  }

  /* ── return props ───────────────────────────────────────────────────── */
  return {
    props: {
      pokemonList,
      currentPage,
      searchName,
      evolutionTriggers,
      evoPage: currentEvo,
    },
  };
};
