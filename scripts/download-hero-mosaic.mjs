import { mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const dest = new URL("../public/sites/www-twelvelabs-io-a368af44/root-8a5edab2/videos/mosaic/", import.meta.url);

const clips = [
  "23_Caravan-football-game-170104-filmsupply.mp4",
  "02_FilmSupply 550106.mp4",
  "16_FilmSupply 305933.mp4",
  "03_boxers-silhouettes-starting-to-fight-at-dark-ring-boxing-fight-sparring-boxers-mma--SBV-314674447-4K.mp4",
  "30_cinematic-shot-of-young-woman-exploring-scenic-ocean-coastline-at-sunset-vacation-t-SBV-346572755-4K.mp4",
  "01_aerial-view-majestic-herd-of-wild-horses-running-in-nature-slow-motion-SBV-347737041-4K.mp4",
  "05_FilmSupply-170097.mp4",
  "25_FilmSupply 685262.mp4",
  "11_white-necked-jacobin-bird-perching-on-a-branch-slow-motion-known-as-the-great-jacob-SBV-347328566-HD.mp4",
  "04_aerial-view-of-the-golden-gate-bridge-in-san-francisco-california-SBV-337779779-4K.mp4",
  "15_super-slow-motion-shot-of-basketball-basketball-slam-dunk-shot-on-phantom-flex-4k-SBV-347622462-4K.mp4",
  "22_Mika Matin-basketball-practice-270926-filmsupply.mp4",
  "13_Ben Sturgulewski-nature-fpv-aerials-508421-filmsupply.mp4",
  "07_Remco Merbis-young-couple-meeting-and-falling-in-love-746505-filmsupply.mp4",
  "09_FilmSupply 170109.mp4",
  "31_bridge.mp4",
];

const base = "https://raw.githubusercontent.com/hazal-ozkaya/rectachain-media-480/main/";

await mkdir(dest, { recursive: true });

async function one(name, i) {
  const url = base + encodeURIComponent(name).replace(/%2F/g, "/");
  const file = new URL(`clip-${String(i).padStart(2, "0")}.mp4`, dest);
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${name}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(file));
  console.log("ok", file.pathname.split("/").pop());
}

const q = clips.map((name, i) => [name, i]);
const workers = Array.from({ length: 4 }, async () => {
  while (q.length) {
    const [name, i] = q.shift();
    try {
      await one(name, i);
    } catch (err) {
      console.error("fail", name, err.message);
    }
  }
});
await Promise.all(workers);
console.log("done");
