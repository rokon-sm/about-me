/* ============================================================
   EDIT YOUR DETAILS HERE — you never need to touch the other files
   ============================================================
   Put your own files inside the "assets" folder, then change the
   file names below if yours are named differently.
*/
window.CONFIG = {
  // Browser tab title
  tabTitle: "Rokon",

  // Black screen shown before the site opens
  splashText: "Tap to enter",
  goFullscreen: true,          // true = enter fullscreen (F11 style) on tap

  // Main profile
  name: "Rokon",
  bio: "Just Testing!",
  avatar: "assets/avatar.jpg",
  favicon: "assets/favicon.png",   // small icon in the browser tab

  // Background: an image (.jpg .png .webp .gif) or a video (.mp4 .webm)
  background: "assets/background.png",
  backgroundBlur: 8,               // blur strength in px (0 = no blur)

  // Music (an .mp4 or .mp3 file is fine)
  music: {
    file: "assets/music.mp3",
    title: "Henry Moodie - me, myself and i",   // shown in the "Now playing" box
    label: "Now playing",
    volume: 0.5,                   // 0 to 1
    loop: true
  },

  // The three numbers under the music box (add, remove or rename freely)
  stats: [
    { value: "100", label: "Humor" },
    { value: "1",   label: "Friends" },
    { value: "2",   label: "Projects" }
  ],

  // Buttons. "open" = opens the link, "copy" = copies the text to clipboard.
  links: {
    github:    { type: "open", value: "https://github.com/rokon-sm",    tooltip: "GitHub" },
    instagram: { type: "open", value: "https://instagram.com/smrok.on", tooltip: "Instagram" },
    discord:   { type: "copy", value: "sm_rokon",                       tooltip: "Copy Discord username", toast: "Discord username copied!" },
    mail:      { type: "copy", value: "smrokon@proton.me",              tooltip: "Copy email address",    toast: "Email address copied!" }
  }
};
