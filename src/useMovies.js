import { useEffect, useState } from "react";

const KEY = "19395fb9";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  useEffect(
    function () {
      // callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsloading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);
          setError("");
        } catch (err) {
          console.error(err.message);

          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsloading(false);
        }
      }

      if (!query.length) {
        setMovies([]);
        setError("");
        return;
      }

      // handleCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
