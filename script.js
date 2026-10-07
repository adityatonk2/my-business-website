(() => {
  const NUM = "918192032112";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wa = t => `https://wa.me/${NUM}?text=${encodeURIComponent(t)}`;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // WhatsApp links: every [data-wa] gets its prefilled message
  $$("[data-wa]").forEach(a => { a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener"; });

  // Nav: shrink on scroll + progress bar + mobile menu
  const nav = $("#nav"), bar = $("#progress"), menu = $("#menu"), burger = $("#burger");
  addEventListener("scroll", () => {
    nav.classList.toggle("small", scrollY > 40);
    bar.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + "%";
  }, { passive: true });
  burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o); };
  $$("nav a").forEach(a => a.addEventListener("click", () => { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); }));

  // Hero chips + problem cards jump to the right service
  const go = k => {
    if (k === "pick") return $("#pick").scrollIntoView();
    const t = $("#svc-" + k); t.scrollIntoView(); t.animate([{ outline: "3px solid #FF5A36" }, { outline: "3px solid transparent" }], { duration: 1600 });
  };
  $$("[data-go]").forEach(b => b.addEventListener("click", () => go(b.dataset.go)));

  // Service selector
  const picks = {
    web: ["You probably need a focused business website.", "₹5,000", "2–5 days", "Hi Aditya, I'm interested in getting a website for my business."],
    ai: ["You probably need an automation that removes a repeated task.", "₹10,000", "1–3 weeks", "Hi Aditya, I want to discuss an AI/automation idea."],
    ai2: ["You probably need an AI assistant or workflow built around your data.", "₹10,000", "1–3 weeks", "Hi Aditya, I want to discuss an AI/automation idea."],
    soft: ["You probably need a small first version (MVP) of your app.", "₹15,000", "2–6 weeks", "Hi Aditya, I have a software idea I'd like to discuss."],
    fix: ["Send me what's broken and I'll tell you what it takes.", "₹2,500", "Same day to a few days", "Hi Aditya, I need help fixing an existing website/software project."],
    unsure: ["That's fine. A short chat is enough to find the simplest route.", "Free chat", "Reply within a day", "Hi Aditya, I'm not sure what I need yet. Can we talk?"]
  };
  $$("#pickBtns button").forEach(b => b.addEventListener("click", () => {
    $$("#pickBtns button").forEach(x => x.classList.toggle("on", x === b));
    const [t, p, d, m] = picks[b.dataset.k];
    $("#pickOut").innerHTML = `<p>${t}</p><p class="p">${p === "Free chat" ? p : "Starting at " + p}</p><p>Typical delivery: ${d}</p><a class="btn" href="${wa(m)}" target="_blank" rel="noopener">Talk on WhatsApp →</a>`;
  }));

  // Pricing estimator (rough ranges only)
  const ranges = [["₹5K – ₹10K", "₹10K – ₹20K", "₹20K+"], ["₹10K – ₹20K", "₹20K – ₹40K", "₹40K+"], ["₹10K – ₹20K", "₹20K – ₹40K", "₹40K+"], ["₹15K – ₹30K", "₹30K – ₹75K", "₹75K+"], ["₹2.5K – ₹5K", "₹5K – ₹10K", "₹10K+"]];
  const est = () => { $("#eOut").textContent = `Estimated starting range: ${ranges[$("#eType").value][$("#eSize").value]}. This is only an estimate; I'll confirm the price before we build.`; };
  $("#eType").onchange = $("#eSize").onchange = est; est();

  // Projects + modal
  const P = [
    ["AI Social Media Manager", "Next.js · AI · GCP", "AI-powered content workflow for generating and managing social content.", "Content planning was slow and scattered across tools.", "A single workflow that drafts and organises posts with AI.", "> generate(post)\n> schedule()\n> review()"],
    ["AI Video Processing Pipeline", "Python · AI · APIs · Cloud", "Automated video processing and clipping workflows powered by AI.", "Cutting long videos into clips by hand takes hours.", "A pipeline that processes videos and produces clips automatically.", "$ ingest video.mp4\n$ detect highlights\n$ export clips/"],
    ["Civic Lens", "React · APIs · Maps · AI", "A smart-city platform for reporting and managing civic problems.", "Citizens have no simple way to report problems and track them.", "A map-based platform for reporting and managing civic issues.", "POST /report\nGET /issues?near=me\nstatus: in-progress"],
    ["Digital Community Platform", "Full stack · MongoDB · Cloud", "A community platform connecting people with local businesses and opportunities.", "Local businesses and people struggle to find each other.", "A full-stack platform that connects them in one place.", "users{}  businesses{}\nmatch(local, need)"]
  ];
  const wrap = $("#projects"), dlg = $("#modal");
  P.forEach((p, i) => { const b = document.createElement("button"); b.className = "pj"; b.innerHTML = `<div class="shot"><pre>${p[5]}</pre></div><div class="t"><b>${p[0]}</b><small>${p[1]}</small><p>${p[2]}</p></div>`; b.onclick = () => open(i); wrap.append(b); });
  function open(i) {
    const p = P[i];
    $("#mBody").innerHTML = `<h3 id="mTitle">${p[0]}</h3><p><b>Problem:</b> ${p[3]}</p><p><b>Solution:</b> ${p[4]}</p><p><b>Technology:</b> ${p[1]}</p><p><a href="https://github.com/adityatonk2" target="_blank" rel="noopener">See more on GitHub →</a></p>`;
    dlg.showModal();
    if (!reduce && window.gsap) gsap.from(dlg, { y: 24, opacity: 0, duration: .35 });
  }
  $("#mClose").onclick = () => dlg.close();
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  // GSAP: one hero sequence, process timeline, conviction reveal
  if (reduce || !window.gsap) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from([".tag", "h1", ".lead", ".hero .cta-row"], { y: 30, opacity: 0, duration: .8, stagger: .12, ease: "power3.out" });
  gsap.from(".flow span", { y: 20, opacity: 0, stagger: .15, delay: .6, duration: .5 });
  $$(".steps li").forEach(li => ScrollTrigger.create({ trigger: li, start: "top 80%", onEnter: () => li.classList.add("on"), onLeaveBack: () => li.classList.remove("on") }));
  gsap.from(".conv li", { opacity: 0, x: -30, stagger: .2, scrollTrigger: { trigger: ".conv ul", start: "top 80%" } });
  gsap.from(".big-q", { opacity: 0, y: 40, duration: 1, scrollTrigger: { trigger: ".conv", start: "top 70%" } });
})();
