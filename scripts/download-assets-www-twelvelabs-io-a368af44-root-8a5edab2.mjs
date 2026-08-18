import { mkdir, writeFile } from "node:fs/promises";
import { basename } from "node:path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const root = new URL("../public/sites/www-twelvelabs-io-a368af44/", import.meta.url);
const page = new URL("root-8a5edab2/", root);
const shared = new URL("shared/", root);
const fonts = new URL("fonts/", shared);

const images = [
  ["banner-logo-strip.png", "https://framerusercontent.com/images/RI12VW53mjFT0vc3cYDbWwDeBE.png?width=3945&height=108"],
  ["jockey-ui.png", "https://framerusercontent.com/images/9Dk2VMiThR4wsySxv42hiiwdDBE.png?width=604&height=314"],
  ["jockey-wordmark.svg", "https://framerusercontent.com/images/N7QNfdt3u3dpWfejlaVxCHei6E.svg?width=120&height=18"],
  ["hero-visual.png", "https://framerusercontent.com/images/nUghrpRDrBnm65VAzyao7IjxRno.png?width=1598&height=1440"],
  ["hero-arc.svg", "https://framerusercontent.com/images/np6HkmAIeaU9NqrRohQ6hneoiNI.svg?width=1680&height=1198"],
  ["infra-card.png", "https://framerusercontent.com/images/s2phadnnlO3sNvpG3IAFWqhTWs.png?width=600&height=410"],
  ["workflow-a.png", "https://framerusercontent.com/images/kzyC48iyy75xy8n9TLUT6hKvAIc.png?width=2130&height=1058"],
  ["workflow-b.png", "https://framerusercontent.com/images/IoZNEoctxINbPTAce43aiEvlkd4.png?width=2130&height=1058"],
  ["workflow-c.png", "https://framerusercontent.com/images/ERhFVXR8YQMpsIgM5mii13D8c.png?width=2130&height=1058"],
  ["workflow-frame.svg", "https://framerusercontent.com/images/GdQFFX8feiXWZBm63HIxWpAgva8.svg?width=1680&height=653"],
  ["solutions-visual.png", "https://framerusercontent.com/images/YaSK3URJGxMiUEFJbi7qjDCfbkc.png?width=1507&height=1306"],
  ["security-a.png", "https://framerusercontent.com/images/4mgoTlmv0vT0M8DFqTJnvE25iwg.png?lossless=1&width=1360&height=998"],
  ["security-b.png", "https://framerusercontent.com/images/Jv4lpQlDBOjrI4lzzIHSnTQe4.png?lossless=1&width=1360&height=998"],
  ["model-frame-a.svg", "https://framerusercontent.com/images/34IibeXUmMUb3pMFyH49UlDNIws.svg?width=1680&height=854"],
  ["model-frame-b.svg", "https://framerusercontent.com/images/9PG6e3JXFou0b275rmkrCHk6oE.svg?width=1680&height=854"],
  ["model-marengo.png", "https://framerusercontent.com/images/qGq0H3wpDVKaGWZPoCjFjnKI8s.png?width=700&height=700"],
  ["model-pegasus.png", "https://framerusercontent.com/images/7jhvDpbLe3i5HfGaGT3va8igHXU.png?width=716&height=712"],
  ["cta-still.png", "https://framerusercontent.com/images/fD2lMybcMtBvhQOwCefWjabcdM0.png?lossless=1&width=568&height=508"],
  ["favicon.png", "https://framerusercontent.com/images/rPgUJ0yBWlnbaATq5j4kUxflLE.png"],
  ["apple-touch.png", "https://framerusercontent.com/images/wsbJY5NWtk7pfIYT4VUG1PjCw.png"],
];

const videos = [
  ["tl-01-alpha.webm", "https://framer-videos.twelvelabs.io/assets/TL_01_alpha.webm"],
  ["horse-cta.mp4", "https://framer-videos.twelvelabs.io/assets/horse-cta-video.mp4"],
];

const fontFiles = [
  ["milling-duplex-1mm.woff2", "https://framerusercontent.com/assets/8I5HWpItJbV4MCFgD7QkryfFGqE.woff2"],
  ["milling-triplex-15mm.woff2", "https://framerusercontent.com/assets/pfJkmtzCm0YiWwnWdNReNhKXYw.woff2"],
  ["milling-duplex-1mm-italic.woff2", "https://framerusercontent.com/assets/Pm1pM0sxKTpWEAwroalSSF1RzkM.woff2"],
  ["milling-triplex-1mm.woff2", "https://framerusercontent.com/assets/NA0Me8AFFlQJ3DSBRHc9gGXInk.woff2"],
  ["milling-trial-duplex.woff2", "https://framerusercontent.com/assets/yvo4uBnnAFRATXf93jnYyvSv0M.woff2"],
];

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return dest;
}

async function runBatch(items, dir, concurrency = 4) {
  await mkdir(dir, { recursive: true });
  const q = [...items];
  const workers = Array.from({ length: concurrency }, async () => {
    while (q.length) {
      const [name, url] = q.shift();
      const dest = new URL(name, dir);
      try {
        await download(url, dest);
        console.log("ok", name);
      } catch (err) {
        console.error("fail", name, err.message);
      }
    }
  });
  await Promise.all(workers);
}

await mkdir(new URL("images/", page), { recursive: true });
await mkdir(new URL("videos/", page), { recursive: true });
await runBatch(images, new URL("images/", page));
await runBatch(videos, new URL("videos/", page), 2);
await runBatch(fontFiles, fonts);
console.log("done");
