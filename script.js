const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const frameCount = frameNames.length;
const images = [];
let loadedImages = 0;

const currentFrame = index => (
  `video_frames/${frameNames[index]}`
);

// Preload images
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
  img.onload = () => {
    loadedImages++;
    // Draw the first frame as soon as it's loaded
    if (i === 0) {
      drawImageScaled(images[0]);
    }
  };
}

// Function to draw image covering the canvas (like object-fit: cover)
function drawImageScaled(img) {
  var canvas = context.canvas;
  var hRatio = canvas.width / img.width;
  var vRatio = canvas.height / img.height;
  var ratio  = Math.max(hRatio, vRatio);
  var centerShift_x = (canvas.width - img.width * ratio) / 2;
  var centerShift_y = (canvas.height - img.height * ratio) / 2;  
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);  
}

// Scroll event listener
window.addEventListener('scroll', () => {  
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScrollTop;
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );
  
  // Wait using requestAnimationFrame for smoother performance
  requestAnimationFrame(() => {
    if (images[frameIndex] && images[frameIndex].complete) {
      drawImageScaled(images[frameIndex]);
    }
  });
});

// Resize event listener
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const scrollTop = document.documentElement.scrollTop;
  const maxScrollTop = document.documentElement.scrollHeight - window.innerHeight;
  // Prevent division by zero if there's no scrollable area
  const scrollFraction = maxScrollTop > 0 ? (scrollTop / maxScrollTop) : 0; 
  const frameIndex = Math.min(
    frameCount - 1,
    Math.floor(scrollFraction * frameCount)
  );
  
  if (images[frameIndex] && images[frameIndex].complete) {
    drawImageScaled(images[frameIndex]);
  }
});
