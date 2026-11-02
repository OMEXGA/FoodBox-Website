import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// Serve all static files (HTML, CSS, images, etc.) from the project root
app.use(express.static(__dirname));

// Fallback: any unknown route → index.html
app.get('/{*splat}', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.listen(PORT, () => {
  console.log(`\n  🚀 Fit-Grid server running at http://localhost:${PORT}\n`);
});
