import { spawn } from "child_process";

// node videos ./src
const parent = process.argv[2];
let videos = [];
if (process.argv[2]) {
  const start = parseInt(process.argv[3]) ? parseInt(process.argv[3]) : 1;
  const end = parseInt(process.argv[4]) ? parseInt(process.argv[4]) : 1;

  for (let i = start; i <= end; i++) {
    videos.push(i);
  }
  videos.reverse();
  processVideo();
} else {
  console.log(`É necessário criar um diretório de nivel superior`);
}

function resize(video, quality) {
  const p = new Promise((resolve, reject) => {
    const ffmpeg = spawn("./ffmpeg/bin/ffmpeg", [
      "-i",
      `${parent}/${video}.mp4`,
      "-codec:v",
      "libx264",
      "-profile:v",
      "main",
      "-preset",
      "slow",
      "-b:v",
      "400k",
      "-maxrate",
      "400k",
      "-bufsize",
      "800k",
      "-vf",
      `scale=-2:${quality}`,
      "-threads",
      "0",
      "-b:a",
      "128k",
      `${parent}/resultado/${video}-${quality}.mp4`,
    ]);
    ffmpeg.stderr.on("data", (data) => {
      console.log(data);
    });
    ffmpeg.on("close", (code) => {
      resolve();
    });
  });

  return p;
}

async function processVideo() {
  let video = videos.pop();
  if (video) {
    try {
      await resize(video, 720);
      await resize(video, 480);
      await resize(video, 360);
      await resize(video, 144);
      console.log(`Videos renderizados - ${video}`);
      processVideo();
    } catch (error) {
      console.log(e);
    }
  }
}
