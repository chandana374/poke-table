// src/pages/index.tsx
import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import PokemonTable from "../components/pokrmonTable";
import type { Pokemon } from "../../../types/pokemon";

interface PageProps {
  pokemonList: Pokemon[];
  currentPage: number;
  searchName: string;
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                             */
/* -------------------------------------------------------------------------- */
export default function Home({
  pokemonList,
  currentPage,
  searchName,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-extrabold text-yellow-400 mb-6">
        PokéDex SSR Demo
      </h1>

      <PokemonTable
        pokemonList={pokemonList}
        currentPage={currentPage}
        searchName={searchName}
      />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/*  getServerSideProps – runs on EVERY request (SSR)                           */
/* -------------------------------------------------------------------------- */
export const getServerSideProps: GetServerSideProps<PageProps> = async ({
  query,
}) => {
  // 1 ▪ Read query parameters (all arrive as string | string[] | undefined)
  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page;
  const nameParam = Array.isArray(query.name) ? query.name[0] : query.name;

  const currentPage = Math.max(parseInt(pageParam || "1", 10), 1);
  const searchName = (nameParam || "").trim().toLowerCase();

  let pokemonList: Pokemon[] = [];

  // 2 ▪ Fetch data depending on whether we're filtering by name
  try {
    if (searchName) {
      /* Exact‑name endpoint -------------------------------------------------- */
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(searchName)}`
      );

      if (res.ok) {
        const data = await res.json();
        pokemonList = [{ name: data.name, url: data.species.url }];
      } else {
        // name not found → keep list empty
        pokemonList = [];
      }
    } else {
      /* Paginated list endpoint --------------------------------------------- */
      const limit = 20;
      const offset = (currentPage - 1) * limit;
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
      );
      const data = await res.json();
      pokemonList = data.results; // API already returns { name, url }[]
    }
  } catch {
    // On network error fall back to empty list
    pokemonList = [];
  }

  // 3 ▪ Return props for the React component
  return {
    props: {
      pokemonList,
      currentPage,
      searchName,
    },
  };
};
