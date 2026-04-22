import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

const VITE_GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const TMDB_API_KEY = "f81980ff410e46f422d64ddf3a56dddd";
const genAI = new GoogleGenerativeAI(VITE_GEMINI_API_KEY);

const fetchMoviesFromTitles = async (titles) => {
  const movieResults = [];
  for (const title of titles) {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&language=en-US&page=1&include_adult=false`);
      if (res.data.results && res.data.results.length > 0) {
        const sorted = res.data.results.sort((a,b) => b.popularity - a.popularity);
        if (sorted[0].backdrop_path) {
            movieResults.push(sorted[0]);
        }
      }
    } catch (err) {
      console.error("TMDB search failed for", title, err.message);
    }
  }
  return movieResults;
};

async function test() {
  const input = "Funny movies from the 90s";
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const prompt = `You are an expert movie connoisseur. The user says: "${input}". 
    Respond ONLY with a valid JSON array containing exactly 4-6 exact movie strings that perfectly match the user's request. 
    Important: Give only JSON format starting with [ and ending with ], with double quotes. Do not include markdown code blocks.
    Example: ["Inception", "The Matrix", "Blade Runner 2049", "Interstellar"]`;

    console.log("Generating content...");
    const result = await model.generateContent(prompt);
    
    // Check if result.response is a promise. It shouldn't be. 
    // In @google/generative-ai, result.response is a property usually, not a promise.
    const response = result.response; 
    let text = response.text().trim();
    
    console.log("Raw text from Gemini:", text);

    if (text.startsWith("```json")) {
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    }

    let recommendedTitles = [];
    try {
      recommendedTitles = JSON.parse(text);
    } catch (parseErr) {
      console.log("Failed to parse AI output:", text);
      throw new Error("Invalid AI format");
    }

    console.log("Parsed titles:", recommendedTitles);

    const moviesData = await fetchMoviesFromTitles(recommendedTitles);
    console.log("Movies data length:", moviesData.length);
  } catch (err) {
    console.error("Error occurred:", err);
  }
}

test();
