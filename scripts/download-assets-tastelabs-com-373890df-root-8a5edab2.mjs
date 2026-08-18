import { mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";

const root = new URL("../public/sites/tastelabs-com-373890df/", import.meta.url);
const page = new URL("root-8a5edab2/", root);
const shared = new URL("shared/", root);
const fonts = new URL("fonts/", shared);
const images = new URL("images/", page);
const videos = new URL("videos/", page);

const imageFiles = [
  ["logo.svg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a306ae79b1ce1b28e27e16b_5b4c828c6dbacad50282c2cdc22e9af0_taste_Logo.svg"],
  ["logo-black.svg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a4f4fe67db139e22e8ee0fe_logo_black.svg"],
  ["btn-icon-1.svg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a4636bb8a1cc7d7c60a4a14_160c7ca07ef76d7691c66b85b13f14ac_btn_icon_1.svg"],
  ["btn-icon-2.svg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a4636bba2a554599fb5249b_ddb41a8244dc0b690deafb351b9e9b3f_btn_icon_2.svg"],
  ["menu-decor.png", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a292456778cdc9244f8d0c1_5f3499b658ebd37d1ea72444be37c33c_Group%201000007827%20%281%29.png"],
  ["bracket-open.svg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1d777ccb930df5affd3cd5_Vector%20(2).svg"],
  ["bracket-close.svg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1d777ccb930df5affd3cdb_Vector%20(3).svg"],
  ["arrow-up-right.svg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a43872a2a8b82ac75205bce_39437e68455fc81757f9cb88f670ec55_arrow-up-right.svg"],
  ["diamond.svg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a217a8a46d15d5baed4d236_bc7fff0a93b61f29d5c683ca52cfdfbf_Frame%2027449.svg"],
  ["footer-room.png", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a2bd65a50c8fb0b6ae6ad06_Group%201000008383.png"],
  ["carousel-01.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb1142b609298bb2d75d_448c933e9deebbb2156d4ae1d58d188c_Frame%201171280140.avif"],
  ["carousel-02.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb117f04b11c29aea486_ab1e2f502f4f5a9711ee55518b286ae9_Frame%201171280141.avif"],
  ["carousel-03.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb117fba4e209a4c71ea_4aa8e137ef5595f1cdfce591c930ae61_Frame%201171280139.avif"],
  ["carousel-04.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb1142b609298bb2d74b_093da6815205c58ef56f0fb47c1e9da8_Frame%201171280138.avif"],
  ["carousel-05.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb119b397fb853e34b86_de05d9ebd3cc9297bd79ca13f63bbd86_Frame%201171280137.avif"],
  ["carousel-06.png", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb112dd15c70d1860836_ee4e1d2628004fdd3fa05ce3cfacfdb4_Frame%201171280131.png"],
  ["carousel-07.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb11f8dc9bd6d894b70b_32646e38172599d705d461d760c24fbe_Frame%201171280132.avif"],
  ["carousel-08.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb115e1240f3d257f84b_3348cbd99d403a1c72c8cbc60dca1305_Frame%201171280136.avif"],
  ["carousel-09.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb11dd8c37dcbb6096e9_05124003ce29eb0bf8befdc97f0f1022_Frame%201171280129.avif"],
  ["carousel-10.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb115840e0a456bc0585_feb11ca417d753006dc7d42ee9318870_Frame%201171280125.avif"],
  ["carousel-11.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb115840e0a456bc0580_c0dbb93828d225013217535c8d8cc21e_Frame%201171280128.avif"],
  ["carousel-12.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb1183ddf2489b3d7bc7_eb46a89d20bcb0ee031b78603fb13fcf_Frame%201171280130.avif"],
  ["carousel-13.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb11f6ced96c53b657a3_75682d69f3a3d4e3e22f88e05d5f8d56_Frame%201171280124.avif"],
  ["carousel-14.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb11ed08fd2374bab01a_e9cd5a7ed19bdca4330eb67fde5539c6_Frame%201171280126.avif"],
  ["carousel-15.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb112fd9144b363a0127_867efbcb282ef55777e85f117637cfcb_Frame%201171280135.avif"],
  ["carousel-16.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50cb1152b12491ba980add_7c4f21fea80a1e9bcff4b3226dee3e7d_Frame%201171280127.avif"],
  ["carousel-17.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50d22a42b609298bb7780d_Frame%201171280059.avif"],
  ["carousel-18.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a50d22a6627c349e8613fca_Frame%201171280142.avif"],
  ["team-ana.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e5a9f4ba81ca00fc311_202605_TheTasteAI_Ana%201.avif"],
  ["team-maria.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6ff0513cfd007b3ebc_202605_TheTasteAI_Maria%201.avif"],
  ["team-lauta.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6f43bb13657f8ff32a_202605_TheTasteAI_Lauta%201.avif"],
  ["team-marcelo.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6f84ce331e9429e3de_202605_TheTasteAI_Marcelo%201.avif"],
  ["team-remi.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6fe7da16cc3735f965_202605_TheTasteAI_Remi%201.avif"],
  ["team-lucas.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6fd6193b3508367ca2_202605_TheTasteAI_Lucas%201.avif"],
  ["team-joseph.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6f162f46304527f1ae_202605_TheTasteAI_Joseph%201.avif"],
  ["team-matthew.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6fca5c9e934a8fa9e5_202605_TheTasteAI_Matthew%201.avif"],
  ["team-hami.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6f81cf1a2962919a3e_202605_TheTasteAI_Hami%201.avif"],
  ["team-dave.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e6f8497e7a448d5fe13_202605_TheTasteAI_Dave%201.avif"],
  ["team-mo.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e70d4ba43c9a67d6ebd_202605_TheTasteAI_Mo%201.avif"],
  ["team-thais.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1e7e7038e1c40ab357ce2e_202605_TheTasteAI_Thais1%201.avif"],
  ["blog-01.jpg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc5/6a762b5fe385e282344f3222_Cover.jpg"],
  ["blog-02.jpg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc5/6a70da7907699e1e8cfb0392_Cover.jpg"],
  ["blog-03.jpg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc5/6a70666d7c6dd0cbdb045cb7_Cover.jpg"],
  ["blog-04.jpg", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc5/6a7065c8f7fdfc347041427d_Cover.jpg"],
  ["blog-05.png", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc5/6a316dfa4e5178fea155101a_6a314b37bfb49b17205f944b_scale.png"],
  ["blog-06.png", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc5/6a316f6be8a916278bc264c9_Group%201000008432.png"],
  ["favicon-light.png", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a61b55e90f07899e23b06fb_favicon-light-mode.png"],
  ["favicon-dark.png", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a61b5567bc0a8c4d4ebe576_favicon-dark-mode.png"],
  ["apple-touch.png", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a1da2ace70c673cd8c75ace_clip.png"],
  ["og.avif", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a267ba46c9323bf936b381c_c78e993f23174a62b521e6c4f939c55b_open-graph%20%284%29.avif"],
];

const videoFiles = [
  ["hero-loop-desktop.webm", "https://footertaste.b-cdn.net/website_home/home_hero_loop_desktop.webm"],
  ["hero-loader-desktop.webm", "https://footertaste.b-cdn.net/website_home/home_hero_loader_desktop.webm"],
  ["hero-loop-mobile.webm", "https://footertaste.b-cdn.net/website_home/home_hero_loop_mobile.webm"],
  ["hero-loader-mobile.webm", "https://footertaste.b-cdn.net/website_home/home_hero_loader_mobile.webm"],
];

const fontFiles = [
  ["Matter-Thin.woff2", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a3399d3c66b89145c5788b7_Matter-Thin.woff2"],
  ["Matter-Light.woff2", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a3399d331c914b2ca49e186_Matter-Regular.woff2".replace("Matter-Regular", "Matter-Light")],
  ["Matter-Regular.woff2", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a3399d331c914b2ca49e186_Matter-Regular.woff2"],
  ["Matter-Medium.woff2", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a3399d3bda9fc380e8ea8b7_Matter-Medium.woff2"],
  ["AzeretSemiMono-Light.otf", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a4f6a21a42841314ba887ca_AzeretSemiMono-Light.otf"],
  ["AzeretSemiMono-Regular.otf", "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a4f6a21aa897632c57a74e0_AzeretSemiMono-Regular.otf"],
  ["Matter-TRIAL-Medium.ttf", "https://footertaste.b-cdn.net/Matter-TRIAL-Medium.ttf"],
];

// Fix Light font URL from extracted @font-face
fontFiles[1][1] = "https://cdn.prod.website-files.com/6a1d5baf94efef5f7c435fc3/6a3399d3a1498acb0b40edc7_Matter-Light.woff2";

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

async function runBatch(items, dir, concurrency = 4) {
  await mkdir(dir, { recursive: true });
  const q = [...items];
  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (q.length) {
        const [name, url] = q.shift();
        try {
          await download(url, new URL(name, dir));
          console.log("ok", name);
        } catch (err) {
          console.error("fail", name, err.message);
        }
      }
    }),
  );
}

await mkdir(images, { recursive: true });
await mkdir(videos, { recursive: true });
await runBatch(imageFiles, images);
await runBatch(videoFiles, videos, 2);
await runBatch(fontFiles, fonts);
console.log("done");
