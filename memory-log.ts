setInterval(() => {
  const mem = process.memoryUsage();
  console.log({
    rss: (mem.rss / 1024 / 1024).toFixed(2) + "MB",
    heapUsed: (mem.heapUsed / 1024 / 1024).toFixed(2) + "MB",
  });
}, 3000);
export {};
