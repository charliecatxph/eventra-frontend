let timer: NodeJS.Timeout | null = null;

function getPreciseTime(): string {
  const now = new Date();
  const unixSeconds = Math.floor(now.getTime() / 1000);
  const milliseconds = now.getMilliseconds().toString().padStart(3, "0");
  return `${unixSeconds}.${milliseconds}`;
}

self.onmessage = function (e: MessageEvent<string>) {
  if (e.data === "start") {
    if (timer) {
      clearInterval(timer);
    }

    self.postMessage(getPreciseTime());

    timer = setInterval(() => {
      self.postMessage(getPreciseTime());
    }, 10);
  } else if (e.data === "stop") {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
};

self.onunload = function () {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};
