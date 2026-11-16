import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import axios from "axios";
import FormData from 'form-data';
import { fileTypeFromBuffer } from "file-type";
import * as cheerio from "cheerio";

const execAsync = promisify(exec);
const tmp = path.join(process.cwd(), "tmp");

if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true });


/* ========== GIF TO MP4 ========= */

async function gifToMp4(url) {
  const id = Date.now();
  const gifPath = path.join(tmp, `${id}.gif`);
  const mp4Path = path.join(tmp, `${id}.mp4`);
  
  const writer = fs.createWriteStream(gifPath);
  const res = await axios({ url, responseType: 'stream' });
  res.data.pipe(writer);
  await new Promise(r => writer.on('finish', r));
  
  await execAsync(`ffmpeg -i "${gifPath}" -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -pix_fmt yuv420p "${mp4Path}"`);
  
  const buffer = fs.readFileSync(mp4Path);
  fs.unlinkSync(gifPath);
  fs.unlinkSync(mp4Path);
  
  return buffer;
}

/* =========== AI =========== */

async function AiChat(options = {}) {
  const url = `https://text.pollinations.ai/${options.text}?model=${options.model || "openai"}`;
  return (await fetch(url)).text();
}

/* =========== Qu.ax Upload =========== */

const extractFromHtml = (html, baseUrl) => {
  const $ = cheerio.load(html);
  const selectors = [
    'meta[property="og:image"]', 'meta[property="og:video"]', 'meta[property="og:audio"]',
    'meta[name="twitter:image"]', 'meta[name="twitter:player"]', 'meta[name="twitter:video"]',
    'link[rel="image_src"]', 'link[rel="video_src"]', 'video source', 'audio source', 'img'
  ];
  
  for (const selector of selectors) {
    let url = $(selector).attr('content') || $(selector).attr('src') || $(selector).attr('href');
    if (url && !url.includes('base64') && !url.startsWith('data:')) {
      if (!url.startsWith('http')) {
        try { url = new URL(url, baseUrl).href; } catch(e) { continue; }
      }
      if (url.match(/\.(jpg|jpeg|png|gif|webp|mp4|mkv|webm|mov|mp3|wav|ogg|m4a|flac)(\?|$)/i)) return url;
    }
  }
  return null;
};

const uploadToQuax = async (buffer) => {
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  form.append('files[]', buffer, { filename: `tmp.${ext}`, contentType: mime });
  const { data } = await axios.post('https://qu.ax/upload.php', form, { headers: form.getHeaders() });
  
  let mediaUrl = typeof data === 'string' ? extractFromHtml(data, 'https://qu.ax') : data.files?.[0]?.url;
  if (!mediaUrl) throw new Error('Upload failed');
  if (mediaUrl.includes('/x/')) return mediaUrl;
  
  const { data: pageHtml } = await axios.get(mediaUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  return extractFromHtml(pageHtml, mediaUrl) || mediaUrl;
};


/* =========== Termai.cc Upload =========== */

async function uploadTmpfiles(buffer) {
    const { ext, mime } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append('file', buffer, { filename: `file.${ext}`, contentType: mime });

    const res = await axios.post("https://c.termai.cc/api/upload?key=AIzaBj7z2z3xBjsk", form, {
        headers: form.getHeaders(),
        timeout: 30000
    });

    if (!res.data?.status || !res.data?.path) throw new Error("Upload failed: " + JSON.stringify(res.data));
    return res.data.path;
}


/* =========== Webp To Mp4 =========== */
async function WebpToMp4(input) {
  const client = axios.create({
    baseURL: 'https://ezgif.com',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 9; CPH1923 Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.7204.179 Mobile Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'sec-ch-ua-platform': '"Android"',
      'sec-ch-ua': '"Not)A;Brand";v="8", "Chromium";v="138", "Android WebView";v="138"',
      'sec-ch-ua-mobile': '?1',
      'origin': 'https://ezgif.com',
      'x-requested-with': 'mark.via.gp',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      'accept-language': 'ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7',
      'priority': 'u=1, i',
      'Cookie': 'stpdOrigin={"origin":"organic"}'
    }
  });

  let data = new FormData();
  if (Buffer.isBuffer(input)) {
    data.append('new-image', input, { filename: 'input.webp' });
    data.append('new-image-url', '');
  } else {
    data.append('new-image', '');
    data.append('new-image-url', input);
  }

  const response1 = await client.post('/webp-to-mp4', data);
  const $ = cheerio.load(response1.data);
  const mp4Link = $('a[href*="/webp-to-mp4/"]').attr('href');
  const fileName = mp4Link.split('/')[2].replace('.html', '');

  const data2 = new FormData();
  data2.append('file', fileName);
  data2.append('ajax', 'true');

  const response2 = await client.post(`/webp-to-mp4/${fileName}?ajax=true`, data2);
  const $2 = cheerio.load(response2.data);
  const videoSrc = $2('video source').attr('src');
  const videoUrl = 'https:' + videoSrc;

  return videoUrl;
}

export { 
  uploadToQuax, 
  uploadTmpfiles, 
  AiChat, 
  gifToMp4,
  WebpToMp4
 };