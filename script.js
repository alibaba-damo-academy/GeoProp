const copyButton = document.querySelector("[data-copy-target]");

if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const target = document.getElementById(copyButton.dataset.copyTarget);
    if (!target) return;

    const text = target.innerText.trim();
    try {
      await navigator.clipboard.writeText(text);
      const original = copyButton.textContent;
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1400);
    } catch {
      copyButton.textContent = "Copy unavailable";
    }
  });
}

const syncGroups = new Map();

document.querySelectorAll("[data-sync-video]").forEach((video) => {
  const groupName = video.dataset.syncVideo;
  if (!syncGroups.has(groupName)) {
    syncGroups.set(groupName, []);
  }
  syncGroups.get(groupName).push(video);
});

syncGroups.forEach((videos) => {
  if (videos.length < 2) return;

  const leader = videos[0];
  const followers = videos.slice(1);

  const sync = () => {
    followers.forEach((video) => {
      if (Number.isFinite(leader.currentTime) && Math.abs(video.currentTime - leader.currentTime) > 0.08) {
        video.currentTime = leader.currentTime;
      }
      if (leader.paused && !video.paused) video.pause();
      if (!leader.paused && video.paused) video.play().catch(() => {});
    });
  };

  videos.forEach((video) => {
    video.addEventListener("loadedmetadata", sync);
    video.addEventListener("play", sync);
    video.addEventListener("seeked", sync);
  });

  window.setInterval(sync, 1200);
});
