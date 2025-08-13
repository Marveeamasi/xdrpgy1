export function changeFavicon(url) {
  if (typeof document === "undefined") return;

  let link = document.querySelector("link[rel*='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.href = url || "/headimg.png";
}