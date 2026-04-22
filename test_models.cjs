const fs = require('fs');
const axios = require('axios');
const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
const API_KEY = match[1].trim();

axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`)
  .then(res => {
     const models = res.data.models.map(m => m.name).filter(n => n.includes('gemini'));
     console.log(models);
  })
  .catch(err => console.error(err.message));
