// src/pages/index.tsx
import { POKE_API } from "@/lib/api";
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import PokemonTable from "../components/pokemonTable";
import EvolutionTable from "../components/evolutionTable";
import type { Pokemon, EvolutionTrigger } from "../../../types/pokemon";

/* ---------- layout constants ---------- */
const HEADER_H = 64;  // 4rem = 64px
const FOOTER_H = 60;  // 3.75rem = 60px

/* ---------- props ---------- */
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
const Home = ({
  pokemonList,
  currentPage,
  searchName,
  evolutionTriggers,
  evoPage,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
    {/* ---------------- Header (fixed) ---------------- */}
    <header
      className="fixed top-0 inset-x-0 z-50 shadow-[0_2px_6px_#00000099]"
      style={{ height: HEADER_H }}
    >
      <div className="bg-gray-950 h-full px-6 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-yellow-400">
          Pokemon SSR Demo
        </h1>
        <span className="text-sm text-gray-400 hidden sm:inline">
          Powered by PokeAPI
        </span>
      </div>
      <div className="h-1 bg-yellow-400" />
    </header>

    {/* ---------------- Main (scrollable) ---------------- */}
    <main
      className="flex-1 overflow-y-auto p-6 space-y-12"
      style={{
        paddingTop: HEADER_H + 16,   // 64 + 16px = account for header + gap
        paddingBottom: FOOTER_H + 16 // 60 + 16px = account for footer + gap
      }}
    >
      <PokemonTable
        pokemonList={pokemonList}
        currentPage={currentPage}
        searchName={searchName}
      />

      <EvolutionTable triggers={evolutionTriggers} currentPage={evoPage} />
    </main>

    {/* ---------------- Footer (fixed) ---------------- */}
    <footer
      className="fixed bottom-0 inset-x-0 z-50 shadow-[0_-2px_6px_#00000099]"
      style={{ height: FOOTER_H }}
    >
      <div className="h-1 bg-yellow-400" />
      <div className="bg-gray-950 h-full flex items-center justify-center text-sm text-gray-400 px-6">
        Built with&nbsp;
        <a
          href="https://nextjs.org"
          className="text-yellow-400 hover:text-yellow-500 underline mx-1"
          target="_blank"
          rel="noreferrer"
        >
          Next.js
        </a>
        &amp;&nbsp;
        <a
          href="https://pokeapi.co"
          className="text-yellow-400 hover:text-yellow-500 underline ml-1"
          target="_blank"
          rel="noreferrer"
        >
          PokeAPI
        </a>
        .
      </div>
    </footer>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  getServerSideProps                                                         */
/* -------------------------------------------------------------------------- */
export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  const page     = Array.isArray(query.page)    ? query.page[0]    : query.page;
  const evoPage  = Array.isArray(query.evoPage) ? query.evoPage[0] : query.evoPage;
  const name     = Array.isArray(query.name)    ? query.name[0]    : query.name;

  const currentPage = Math.max(parseInt(page ?? "1", 10), 1);
  const currentEvo  = Math.max(parseInt(evoPage ?? "1", 10), 1);
  const searchName  = (name ?? "").trim().toLowerCase();

  /* ---- Fetch Pokémon list ---- */
  let pokemonList: Pokemon[] = [];
  try {
    if (searchName) {
      const res = await fetch(`${POKE_API}/pokemon/${encodeURIComponent(searchName)}`);
      if (res.ok) {
        const data = await res.json();
        pokemonList = [{ name: data.name, url: data.species.url }];
      }
    } else {
      const limit = 20;
      const offset = (currentPage - 1) * limit;
      const res = await fetch(`${POKE_API}/pokemon?limit=${limit}&offset=${offset}`);
      const data = await res.json();
      pokemonList = data.results;
    }
  } catch {
    pokemonList = [];
  }

  /* ---- Fetch evolution triggers ---- */
  let evolutionTriggers: EvolutionTrigger[] = [];
  try {
    const evoLimit  = 5;
    const evoOffset = (currentEvo - 1) * evoLimit;
    const res = await fetch(
      `${POKE_API}/evolution-trigger/?limit=${evoLimit}&offset=${evoOffset}`
    );
    const data = await res.json();
    evolutionTriggers = data.results;
  } catch {
    evolutionTriggers = [];
  }

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

export default Home;
