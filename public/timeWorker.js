/* Time Worker for Next.js
 * This worker runs in its own thread and handles time updates
 */
self.onmessage = function (e) {
  startTimer();
};

function startTimer() {
  try {
    if (self.timeInterval) {
      clearInterval(self.timeInterval);
    }

    self.timeInterval = setInterval(() => {
      const now = new Date();
      self.postMessage(now.toISOString());
    }, 1000);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
}

startTimer();

self.addEventListener("unload", () => {
  if (self.timeInterval) {
    clearInterval(self.timeInterval);
  }
});
