/* Selected Work 2022–Present.
   Media lives in media/ — images re-encoded to WebP at 1920px, which
   took them from 193MB to 7MB. The full-resolution originals stay in
   the folders beside it and are kept out of git.

   Field limits are set by the cells they render into:
     name  <= 15 chars  ->  the "[ NAME ]" line in the meta cell
     title <= 15 chars  ->  status cell, line 1
     role  <= 15 chars  ->  status cell, line 2
   crop trims baked-in black bars: { x, y } are the fraction taken off
   EACH side, horizontally and vertically. Measured off the files:
     - both PombosComSwag clips: 60px bars top and bottom of 1080
     - filmtitle.mp4: 60px top/bottom plus ~150px of 1920 at the sides
     - auto-de-fe montagem: 50px left and right of 1600, in all 8 frames
   A couple of extra px are included so no dark blend row survives.

   date is "MM/YYYY" and shows verbatim in the bar. Only three months
   are known so far, read off dated screenshot filenames in the media;
   every other month is "XX" pending the real one. Replace the XX and
   it appears — nothing else to change. */
window.MEDIA_BASE = "";   // the media now sits beside index.html

window.PROJECTS = [
  {
    name: "SESH.PT", short: "SESH.PT",
    title: "WEBSITE", role: "CREATIVE DIR.",
    year: "2026", date: "08/2026",
    client: "sesh.pt",
    link: "https://sesh.pt",
    desc: "Founder and creative director of sesh — led the vision, identity, and product from first sketch to launch: a single home for independent cinema in Portugal.",
    media: [
      { src: "media/sesh/Screenshot 2026-10-07 at 13.51.09.webp", type: "image" },
      { src: "media/sesh/Screenshot 2026-10-07 at 13.51.31.webp", type: "image" },
      { src: "media/sesh/Screenshot 2026-10-07 at 13.51.49.webp", type: "image" },
      { src: "media/sesh/sesh2 copy.webp", type: "image" }
    ]
  },
  {
    name: "A NOITE", short: "A NOITE",
    title: "SHORT FILM", role: "VISUAL IDENTITY",
    year: "2026", date: "07/2026",
    client: "A Noite em Que Aprendi a Voar",
    link: null,
    desc: "Graphic designer and visual identity lead on A Noite em Que Aprendi a Voar — built the film's graphic universe from zero.",
    media: [
      { src: "media/a noite em que aprendi a voar, visual identity/LUCIO.mp4", type: "video" },
      { src: "media/a noite em que aprendi a voar, visual identity/PombosComSwag.mp4", type: "video",
        crop: { x: 0, y: 0.0574 } },
      { src: "media/a noite em que aprendi a voar, visual identity/PombosComSwag2.mp4", type: "video",
        crop: { x: 0, y: 0.0574 } },
      { src: "media/a noite em que aprendi a voar, visual identity/Screenshot 2026-10-07 at 13.53.52.webp", type: "image" },
      { src: "media/a noite em que aprendi a voar, visual identity/SUNSSsSs.mp4", type: "video" }
    ]
  },
  {
    name: "A NOITE", short: "A NOITE",
    title: "SHORT FILM", role: "FILM TITLE",
    year: "2026", date: "XX/2026",
    client: "A Noite em Que Aprendi a Voar",
    link: null,
    desc: "Motion designer on A Noite em Que Aprendi a Voar — designed and animated the official title sequence.",
    media: [
      { src: "media/a noite em que aprendi a voar , film title, motion desgin/filmtitle.mp4", type: "video",
        crop: { x: 0.0802, y: 0.0574 } }
    ]
  },
  {
    name: "A NOITE", short: "A NOITE",
    title: "SHORT FILM", role: "FILM EDITING",
    year: "2026", date: "07/2026",
    client: "A Noite em Que Aprendi a Voar",
    link: "https://www.youtube.com/watch?v=1P8BEFIPZhk&t=16s",
    desc: "Editor on A Noite em Que Aprendi a Voar — took the film from raw footage to final cut. Selection, structure, pacing, and rhythm, shaping how the story unfolds.",
    media: [
      { src: "media/A Noite em Que Aprendi a Voar 2026 Montagem Short Film/Screenshot 2026-07-12 at 14.36.38.webp", type: "image" },
      { src: "media/A Noite em Que Aprendi a Voar 2026 Montagem Short Film/Screenshot 2026-07-12 at 14.37.12.webp", type: "image" },
      { src: "media/A Noite em Que Aprendi a Voar 2026 Montagem Short Film/Screenshot 2026-07-12 at 14.37.53.webp", type: "image" },
      { src: "media/A Noite em Que Aprendi a Voar 2026 Montagem Short Film/Screenshot 2026-07-12 at 14.38.23.webp", type: "image" },
      { src: "media/A Noite em Que Aprendi a Voar 2026 Montagem Short Film/Screenshot 2026-07-12 at 14.39.25.webp", type: "image" },
      { src: "media/A Noite em Que Aprendi a Voar 2026 Montagem Short Film/Screenshot 2026-07-12 at 14.39.55.webp", type: "image" },
      { src: "media/A Noite em Que Aprendi a Voar 2026 Montagem Short Film/Screenshot 2026-07-12 at 14.40.49.webp", type: "image",
        crop: { x: 0.0792, y: 0 } },
      { src: "media/A Noite em Que Aprendi a Voar 2026 Montagem Short Film/Screenshot 2026-07-12 at 14.41.12.webp", type: "image" }
    ]
  },
  {
    name: "AGUA DAS PEDRAS", short: "AGUA PEDRAS",
    title: "AI SPEC AD", role: "AI DIRECTION",
    year: "2026", date: "XX/2026",
    client: "Água das Pedras",
    link: "https://vimeo.com/1182412337?share=copy&fl=sv&fe=ci",
    desc: "Spec ad for Água das Pedras — concept, direction, and full production using AI.",
    media: [
      { src: "media/agua-das-pedras-2026/1.webp", type: "image" },
      { src: "media/agua-das-pedras-2026/2.webp", type: "image" },
      { src: "media/agua-das-pedras-2026/3.webp", type: "image" },
      { src: "media/agua-das-pedras-2026/4.webp", type: "image" },
      { src: "media/agua-das-pedras-2026/5.webp", type: "image" },
      { src: "media/agua-das-pedras-2026/6.webp", type: "image" },
      { src: "media/agua-das-pedras-2026/7.webp", type: "image" },
      { src: "media/agua-das-pedras-2026/8.webp", type: "image" }
    ]
  },
  {
    name: "CONEXAO DE AGUA", short: "CONEXAO AGUA",
    title: "DOCUMENTARY", role: "FILM EDITING",
    year: "2025", date: "XX/2025",
    client: "Conexão de Água",
    link: "https://www.youtube.com/watch?v=RDhvh0xHvo0",
    desc: "Editor on Conexão de Água — a plumber who had never made art before builds an installation out of the only material he knows. Cut from interview and process footage into a single piece.",
    media: [
      { src: "media/conex\u00e3o de agua/Screenshot 2026-10-07 at 14.11.17.webp", type: "image" },
      { src: "media/conex\u00e3o de agua/Screenshot 2026-10-07 at 14.12.12.webp", type: "image" },
      { src: "media/conex\u00e3o de agua/Screenshot 2026-10-07 at 14.12.27.webp", type: "image" },
      { src: "media/conex\u00e3o de agua/Screenshot 2026-10-07 at 14.13.04.webp", type: "image" },
      { src: "media/conex\u00e3o de agua/Screenshot 2026-10-07 at 14.13.19.webp", type: "image" },
      { src: "media/conex\u00e3o de agua/Screenshot 2026-10-07 at 14.13.34.webp", type: "image" },
      { src: "media/conex\u00e3o de agua/Screenshot 2026-10-07 at 14.14.04.webp", type: "image" }
    ]
  },
  {
    name: "LIGMA", short: "LIGMA",
    title: "DOCUMENTARY", role: "DIR + EDITING",
    year: "2025", date: "XX/2025",
    client: "ligma",
    link: "https://youtu.be/E7prs5-zZk4",
    desc: "Co-directed with Huenu and edited by me — a documentary that cuts between 3D animation and live action.",
    media: [
      { src: "media/ligma/Screenshot 2026-10-07 at 14.05.13.webp", type: "image" },
      { src: "media/ligma/Screenshot 2026-10-07 at 14.05.54.webp", type: "image" },
      { src: "media/ligma/Screenshot 2026-10-07 at 14.06.08.webp", type: "image" },
      { src: "media/ligma/Screenshot 2026-10-07 at 14.06.38.webp", type: "image" },
      { src: "media/ligma/Screenshot 2026-10-07 at 14.06.52.webp", type: "image" },
      { src: "media/ligma/Screenshot 2026-10-07 at 14.07.07.webp", type: "image" },
      { src: "media/ligma/Screenshot 2026-10-07 at 14.07.40.webp", type: "image" }
    ]
  },
  {
    name: "BAD TIME", short: "BAD TIME",
    title: "AI SHORT", role: "AI DIRECTION",
    year: "2025", date: "XX/2025",
    client: "BAD TIME",
    link: "https://vimeo.com/1196809123?share=copy&fl=sv&fe=ci",
    desc: "Short film — sole author, from concept through final cut. An experiment in generative cinema.",
    media: [
      { src: "media/bad-time-2025/1.webp", type: "image" },
      { src: "media/bad-time-2025/2.webp", type: "image" },
      { src: "media/bad-time-2025/3.webp", type: "image" },
      { src: "media/bad-time-2025/4.webp", type: "image" },
      { src: "media/bad-time-2025/5.webp", type: "image" },
      { src: "media/bad-time-2025/6.webp", type: "image" },
      { src: "media/bad-time-2025/7.webp", type: "image" },
      { src: "media/bad-time-2025/8.webp", type: "image" },
      { src: "media/bad-time-2025/9.webp", type: "image" },
      { src: "media/bad-time-2025/10.webp", type: "image" },
      { src: "media/bad-time-2025/11.webp", type: "image" },
      { src: "media/bad-time-2025/12.webp", type: "image" }
    ]
  },
  {
    name: "MID90S", short: "MID90S",
    title: "AI TEASER", role: "AI DIRECTION",
    year: "2025", date: "XX/2025",
    client: "MID90s",
    link: "https://vimeo.com/1136611447?fl=ip&fe=ec",
    desc: "Unofficial teaser for MID90s — directed and produced entirely with AI as a personal exercise.",
    media: [
      { src: "media/mid90s-2025/1.webp", type: "image" },
      { src: "media/mid90s-2025/2.webp", type: "image" },
      { src: "media/mid90s-2025/3.webp", type: "image" },
      { src: "media/mid90s-2025/4.webp", type: "image" },
      { src: "media/mid90s-2025/5.webp", type: "image" },
      { src: "media/mid90s-2025/6.webp", type: "image" },
      { src: "media/mid90s-2025/7.webp", type: "image" }
    ]
  },
  {
    name: "AUTO DE FE", short: "AUTO DE FE",
    title: "PILOT EPISODE", role: "FILM EDITING",
    year: "2025", date: "XX/2025",
    client: "Auto de Fé",
    link: "https://www.youtube.com/watch?v=TFQ6Ca0onAU",
    desc: "Editor on the pilot of Auto de Fé — cut the episode from first assembly to final delivery.",
    media: [
      { src: "media/auto-de-fe-2025-montagem/1.webp", type: "image",
        crop: { x: 0.0325, y: 0 } },
      { src: "media/auto-de-fe-2025-montagem/2.webp", type: "image",
        crop: { x: 0.0325, y: 0 } },
      { src: "media/auto-de-fe-2025-montagem/3.webp", type: "image",
        crop: { x: 0.0325, y: 0 } },
      { src: "media/auto-de-fe-2025-montagem/4.webp", type: "image",
        crop: { x: 0.0325, y: 0 } },
      { src: "media/auto-de-fe-2025-montagem/5.webp", type: "image",
        crop: { x: 0.0325, y: 0 } },
      { src: "media/auto-de-fe-2025-montagem/6.webp", type: "image",
        crop: { x: 0.0325, y: 0 } },
      { src: "media/auto-de-fe-2025-montagem/7.webp", type: "image",
        crop: { x: 0.0325, y: 0 } },
      { src: "media/auto-de-fe-2025-montagem/8.webp", type: "image",
        crop: { x: 0.0325, y: 0 } }
    ]
  },
  {
    name: "AUTO DE FE", short: "AUTO DE FE",
    title: "PILOT EPISODE", role: "GRAPHIC DESIGN",
    year: "2025", date: "XX/2025",
    client: "Auto de Fé",
    link: null,
    desc: "Graphic designer on the pilot of Auto de Fé — created the on-screen graphics, title cards, and visual language of the episode.",
    media: [
      { src: "media/auto-de-fe-2025-graphic/1.webp", type: "image" },
      { src: "media/auto-de-fe-2025-graphic/2.webp", type: "image" },
      { src: "media/auto-de-fe-2025-graphic/3.webp", type: "image" },
      { src: "media/auto-de-fe-2025-graphic/4.webp", type: "image" },
      { src: "media/auto-de-fe-2025-graphic/5.webp", type: "image" },
      { src: "media/auto-de-fe-2025-graphic/6.webp", type: "image" },
      { src: "media/auto-de-fe-2025-graphic/7.webp", type: "image" }
    ]
  },
  {
    name: "CYBERCAFE", short: "CYBERCAFE",
    title: "SKATE SHOP", role: "MOTION DESIGN",
    year: "2023", date: "XX/2023",
    client: "CyberCafé",
    link: null,
    desc: "Motion designer for CyberCafé skate shop — put the brand in motion, from logo animation to content.",
    media: [
      { src: "media/cybercafe-2023/cybercafe.mp4", type: "video" }
    ]
  },
  {
    name: "SUAVE FACTORY", short: "SUAVE FACTORY",
    title: "POWERHOUSE", role: "MOTION DESIGN",
    year: "2023", date: "XX/2023",
    client: "Suavé Factory",
    link: null,
    desc: "Motion designer at Suavé Factory — animated the collective's identity across brand films and content.",
    media: [
      { src: "media/suave-factory-2023-motion/img6131.mp4", type: "video" },
      { src: "media/suave-factory-2023-motion/img6133.mp4", type: "video" },
      { src: "media/suave-factory-2023-motion/season0.mp4", type: "video" },
      { src: "media/suave-factory-2023-motion/suave-animation-v2.mp4", type: "video" },
      { src: "media/suave-factory-2023-motion/timeline-199.mp4", type: "video" }
    ]
  },
  {
    name: "SUAVE FACTORY", short: "SUAVE FACTORY",
    title: "POWERHOUSE", role: "VISUAL IDENTITY",
    year: "2022", date: "XX/2022",
    client: "Suavé Factory",
    link: null,
    desc: "Designer of Suavé Factory's identity — mark, typography, and full graphic system, built from zero.",
    media: [
      { src: "media/suave-factory-2022-logo/1.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/2.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/3.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/4.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/6.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/7.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/8.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/9.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/11.webp", type: "image" },
      { src: "media/suave-factory-2022-logo/12.webp", type: "image" }
    ]
  },
];
