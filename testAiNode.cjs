const axios = require('axios');
const TMDB_API_KEY = "f81980ff410e46f422d64ddf3a56dddd";
const axiosTMDB = axios.create({ baseURL: "https://tmdb-proxy.vercel.app" });

const fetchMoviesFromTitles = async (titles) => {
    try {
      const promises = titles.map(title => 
        axiosTMDB.get(`/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=en-US&page=1&include_adult=false`)
      );
      
      const responses = await Promise.allSettled(promises);
      const movieResults = [];
      
      responses.forEach(result => {
        if (result.status === 'fulfilled') {
            console.log("Success with proxy!");
        } else if (result.status === 'rejected') {
           console.log("REJECTED proxy:", result.reason.response ? result.reason.response.status : result.reason);
        }
      });
      return movieResults;
    } catch (err) {
      console.error("TMDB search failed", err);
      return [];
    }
  };

  fetchMoviesFromTitles(["Die Hard", "The Matrix", "Avatar", "Inception", "Titanic", "Jaws"]).then(() => console.log("Done"));
