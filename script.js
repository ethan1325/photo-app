let video = document.getElementById("video");
let canvas = document.body.appendChild(document.createElement("canvas"));
canvas.classList.add("none");
let ctx = canvas.getContext("2d");
let model;
let time = 0;
let start = false;
let width = 600;
let height = 400;
let detectInterval;
let videoStream;

function detectFace() {
  button = document.getElementById("start-button");
  startStream();
  video.addEventListener("loadeddata", async () => {
    model = await blazeface.load();
    detectInterval = setInterval(detect, 20);
  });
}

ctx.canvas.width = width;
ctx.canvas.height = height;

const startStream = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: { width: width, height: height },
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
      videoStream = stream;
    });
};

const stopStream = () => {
  videoStream.getTracks().forEach(function (track) {
    track.stop();
  });
};

const detect = async () => {
  console.log(time);
  if (time >= 2000) {
    video.parentNode.removeChild(video);
    canvas.parentNode.removeChild(canvas);
    clearInterval(detectInterval);
    let image_data_url = canvas.toDataURL("image/jpeg");
    let download = document.createElement("download");
    let link = document.createElement("a");
    let image = document.createElement("img");
    image.src = image_data_url;
    image.width = width;
    image.height = height;
    image.style.borderRadius = '5px';
    link.classList.add("button");
    link.innerHTML = "Save image";
    link.href = image_data_url;
    link.download = "image";
    link.appendChild(download);
    document.body.append(image);
    document.body.append(link);
    stopStream();
    alert("Picture captured!");
    time = 0;
  }
  if (start === false) {
    button.parentNode.removeChild(button);
    canvas.classList.remove("none");
    start = true;
  }
  const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
  const predictions = await model.estimateFaces(video, returnTensors);

  // console.log(predictions);

  ctx.drawImage(video, 0, 0, width, height);
  if (predictions.length > 0) {
    time += 20;
    predictions.forEach((element) => {
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = "yellow";
      ctx.rect(
        element.topLeft[0],
        element.topLeft[1],
        element.bottomRight[0] - element.topLeft[0],
        element.bottomRight[1] - element.topLeft[1]
      );
      ctx.stroke();

      ctx.fillStyle = "yellow";
      element.landmarks.forEach((landmark) => {
        ctx.fillRect(landmark[0], landmark[1], 10, 10);
      });
    });
  }
  if (predictions.length < 0) {
    time = 0;
  }
  //const model = await blazeface.load();
};

// videoStream.srcObject.getTracks().forEach(function(track) {
//   track.stop();
// });

// startStream();
// video.addEventListener("loadeddata", async () => {
//   model = await blazeface.load();

//   detectInterval = setInterval(detect, 20);
// });
