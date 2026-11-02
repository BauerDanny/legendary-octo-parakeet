const restartCounter = document.querySelector("#last-restart");
const serverStatus = document.querySelector("#server-status");
let restartedAt = NaN;

const updateRestartTime = () => {
  if (!restartCounter || !Number.isFinite(restartedAt)) return;
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - restartedAt) / 60000));
  const days = Math.floor(elapsedMinutes / 1440);
  const hours = Math.floor((elapsedMinutes % 1440) / 60);
  const minutes = elapsedMinutes % 60;
  restartCounter.textContent = days
    ? days + "d " + hours + "h ago"
    : hours + "h " + minutes + "m ago";
};

const showServerStatsUnavailable = () => {
  if (!restartCounter || !serverStatus) return;
  restartCounter.textContent = "Unavailable";
  serverStatus.dataset.status = "unavailable";
  serverStatus.querySelector("span").textContent = "Unavailable";
};

window.addEventListener("blossom:server-stats", (event) => {
  if (!restartCounter || !serverStatus) return;
  const { status, restartedAt: restartDate } = event.detail;
  restartedAt = Date.parse(restartDate);
  if (!Number.isFinite(restartedAt)) {
    showServerStatsUnavailable();
    return;
  }
  updateRestartTime();
  serverStatus.dataset.status = status;
  serverStatus.querySelector("span").textContent = status.charAt(0).toUpperCase() + status.slice(1);
});

window.addEventListener("blossom:server-stats-error", showServerStatsUnavailable);
if (restartCounter) window.setInterval(updateRestartTime, 60000);
const dialog = document.querySelector(".notice-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogMessage = document.querySelector("#dialog-message");

const notices = {
  discord: { title: "Our community is growing!", message: "The Discord invite is being prepared. Check back soon for the community link." }
};

const showNotice = (title, message) => {
  if (!dialog) return;
  dialogTitle.textContent = title;
  dialogMessage.textContent = message;
  dialog.showModal();
};

document.querySelectorAll("[data-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const notice = notices[button.dataset.open];
    if (!notice || !dialog) return;
    showNotice(notice.title, notice.message);
  });
});

document.querySelector("[data-copy-ip]")?.addEventListener("click", async (event) => {
  const address = event.currentTarget.dataset.copyIp;
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard access is unavailable.");
    await navigator.clipboard.writeText(address);
    showNotice("IP copied!", "Paste play.blossomvale.world into Minecraft to join the server.");
  } catch {
    showNotice("Join Blossom Vale", `Server IP: ${address}`);
  }
});

document.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
document.querySelector(".dialog-ok")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === "#" + visible.target.id;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}, { threshold: [0.35, 0.6] });
sections.forEach((section) => observer.observe(section));

const headerArt = document.querySelector(".header-art");
if (headerArt) {
  const header = headerArt.closest(".site-header");
  const homeSource = headerArt.dataset.homeSrc;
  const shopSource = headerArt.dataset.shopSrc;
  const activeSource = headerArt.dataset.activeBar === "shop" ? shopSource : homeSource;
  const previewSource = activeSource === homeSource ? shopSource : homeSource;
  const previewArt = document.createElement("img");

  previewArt.className = "header-art-preview";
  previewArt.src = previewSource;
  previewArt.alt = "";
  previewArt.setAttribute("aria-hidden", "true");
  previewArt.draggable = false;
  header.insertBefore(previewArt, headerArt.nextSibling);

  new Image().src = homeSource;
  new Image().src = shopSource;

  const updateHeaderBar = () => {
    const hoveredOrFocused = document.querySelector(".image-nav a:hover, .image-nav a:focus");
    if (!hoveredOrFocused) {
      header.classList.remove("is-previewing");
      return;
    }
    const targetSource = hoveredOrFocused.classList.contains("home-hitbox") ? homeSource : shopSource;
    header.classList.toggle("is-previewing", targetSource !== activeSource);
  };

  document.querySelectorAll(".image-nav a").forEach((link) => {
    link.addEventListener("pointerenter", updateHeaderBar);
    link.addEventListener("pointerleave", updateHeaderBar);
    link.addEventListener("focus", updateHeaderBar);
    link.addEventListener("blur", updateHeaderBar);
  });
}

window.addEventListener('DOMContentLoaded', () => {
    // Look for any element containing the badge or Netlify iframe
    const badge = document.querySelector('[id*="netlify-badge"]') || document.querySelector('.netlify-badge');
    if (badge) {
        badge.remove();
    }
});

