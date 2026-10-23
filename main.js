/**
 * AYAAN SINGH PARIHAR (VOID-AYAAN) — INTERACTIVE ENGINE
 * Canvas Particles, Web Audio SFX, 3D Tilt, Buddy AI Simulator & Terminal
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (CYBER SOUND FX)
  // ==========================================================================
  class CyberAudioEngine {
    constructor() {
      this.ctx = null;
      this.enabled = false;
      this.init();
    }

    init() {
      const saved = localStorage.getItem('void_audio_sfx');
      this.enabled = saved === 'true';
      this.updateUI();
    }

    getAudioContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    }

    toggle() {
      this.enabled = !this.enabled;
      localStorage.setItem('void_audio_sfx', this.enabled);
      this.updateUI();
      if (this.enabled) {
        this.playChime();
        this.showToast('Audio SFX: Online 🔊');
      } else {
        this.showToast('Audio SFX: Muted 🔇');
      }
    }

    showToast(msg) {
      const toast = document.getElementById('audio-feedback-indicator');
      if (toast) {
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
      }
    }

    updateUI() {
      const btn = document.getElementById('audio-toggle-btn');
      if (btn) {
        if (this.enabled) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      }
    }

    playClick() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {}
    }

    playHover() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.02, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } catch (e) {}
    }

    playChime() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + idx * 0.06;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.06, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.25);
        });
      } catch (e) {}
    }

    playType() {
      if (!this.enabled) return;
      try {
        const ctx = this.getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(900 + Math.random() * 200, ctx.currentTime);

        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.02);
      } catch (e) {}
    }
  }

  const audio = new CyberAudioEngine();

  // Attach audio toggle
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => audio.toggle());
  }

  // ==========================================================================
  // 2. INTERACTIVE NEURAL CONSTELLATION CANVAS
  // ==========================================================================
  const canvas = document.getElementById('neural-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 26 : Math.min(Math.floor((width * height) / 14000), 90);
    const mouse = { x: null, y: null, radius: isMobile ? 70 : 130 };
    let isCanvasPaused = false;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    document.addEventListener('visibilitychange', () => {
      isCanvasPaused = document.hidden;
      if (!isCanvasPaused) requestAnimationFrame(animateParticles);
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 0.8;
        this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(139, 92, 246, ';
        this.baseAlpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse repulsion
        if (mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x -= Math.cos(angle) * force * 3;
            this.y -= Math.sin(angle) * force * 3;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.baseAlpha + ')';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      if (isCanvasPaused) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (1 - dist / 110) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================================================
  // 3. CUSTOM CYBER CURSOR
  // ==========================================================================
  const cursorDot = document.getElementById('cyber-cursor-dot');
  const cursorRing = document.getElementById('cyber-cursor-ring');

  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, select, .cyber-card, .quick-chip');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        audio.playHover();
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
      target.addEventListener('click', () => {
        audio.playClick();
      });
    });
  }

  // ==========================================================================
  // 4. 3D TILT ENGINE
  // ==========================================================================
  const tiltCards = document.querySelectorAll('[data-tilt]');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // ==========================================================================
  // 5. DYNAMIC TYPEWRITER ROLE EFFECT
  // ==========================================================================
  const typewriterElem = document.getElementById('role-typewriter');
  if (typewriterElem) {
    const roles = [
      'AI Systems Architect & Local LLM Engineer',
      'Aspiring Cybersecurity Specialist',
      'Algorithmic Trading Bot Developer',
      'Full-Stack Web Developer & UI Craftsman',
      '10th CS Record Holder (92% Top Scorer)'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        typewriterElem.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typewriterElem.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
      }

      let speed = isDeleting ? 30 : 65;

      if (!isDeleting && charIndex === currentRole.length) {
        speed = 2200; // Pause at end of sentence
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 400;
      }

      setTimeout(typeLoop, speed);
    }
    typeLoop();
  }

  // ==========================================================================
  // 6. REAL-TIME CLOCK TELEMETRY
  // ==========================================================================
  function updateClocks() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false }) + ' IST';
    const liveClock = document.getElementById('live-clock');
    const hudClock = document.getElementById('hud-clock');

    if (liveClock) liveClock.textContent = timeStr;
    if (hudClock) hudClock.textContent = now.toLocaleTimeString('en-US', { hour12: false });
  }
  setInterval(updateClocks, 1000);
  updateClocks();

  // ==========================================================================
  // 7. PROJECTS CATEGORY FILTER
  // ==========================================================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      audio.playClick();

      const filter = tab.dataset.filter;

      projectCards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // ==========================================================================
  // 8. LIVE BUDDY AI HUD CONSOLE SIMULATOR
  // ==========================================================================
  const hudChatLogs = document.getElementById('hud-chat-logs');
  const hudForm = document.getElementById('hud-input-form');
  const hudInput = document.getElementById('hud-user-input');
  const quickChips = document.querySelectorAll('.quick-chip');

  const knowledgeBase = [
    {
      keywords: ['who', 'ayaan', 'about', 'bio', 'intro', 'summary'],
      title: 'Ayaan Singh Parihar — System Architect Bio',
      tool: 'QUERY_JSON_BRAIN: bio_manifesto.json',
      response: `<strong>Ayaan Singh Parihar</strong> (alias: <em>Void-Ayaan</em>) is an entry-level Web Developer and Systems Engineer based in Jhansi, India (284003). 
      <br><br>
      <strong>Key Pillars:</strong>
      <ul>
        <li><strong>Local-First AI Systems:</strong> Architect of <em>Buddy AI</em>, running quantized Qwen3-1.7B GGUF via llamafile with zero API fees, local JSON memory, and Windows SAPI speech.</li>
        <li><strong>Cybersecurity:</strong> Practical study in ethical hacking, incident response, network defense, and Linux systems.</li>
        <li><strong>Algorithmic Finance:</strong> Builder of <em>Tradex</em> scalper utilizing EMA, ADX, VWAP, RSI, and fractals with automated order logs.</li>
        <li><strong>Web Production:</strong> Shipped commercial sites including AM Nation, Shooins B2B, and Saimahima Stays.</li>
        <li><strong>Academic Record:</strong> Scored <strong>92% in 10th Computer Science</strong> (School Top Scorer) at Cathedral College.</li>
      </ul>`
    },
    {
      keywords: ['buddy', 'architecture', 'model', 'gguf', 'llamafile', 'offline'],
      title: 'Buddy AI v2.4 Technical Architecture',
      tool: 'DISPATCH_ROUTER: inspect_buddy_pipeline()',
      response: `<strong>Buddy AI System Specification:</strong>
      <br><br>
      <ul>
        <li><strong>Core Model:</strong> Qwen3-1.7B in 4-bit quantized GGUF format executed through a local <code>llamafile</code> server.</li>
        <li><strong>Zero API Dependency:</strong> Runs 100% offline with zero cloud charges and complete local data privacy.</li>
        <li><strong>Deterministic Action Router:</strong> Separates cached greetings, deterministic utility tools, factual QA, and model-routed actions.</li>
        <li><strong>Benchmark:</strong> Achieved a perfect <strong>10/10</strong> on fixed tool-calling benchmarks.</li>
        <li><strong>Memory Store:</strong> Local JSON memory hierarchies for user notes, proactive speech scheduling, and learned facts.</li>
        <li><strong>Speech & Telemetry:</strong> Integrated Windows SAPI speech synthesis and an interactive local HTML/CSS telemetry HUD.</li>
      </ul>`
    },
    {
      keywords: ['client', 'websites', 'am nation', 'shooins', 'saimahima', 'portfolio', 'web'],
      title: 'Production Client Deployments',
      tool: 'EXECUTE_QUERY: list_published_endpoints()',
      response: `<strong>Shipped Production Websites:</strong>
      <br><br>
      <ol>
        <li><strong>AM Nation</strong> (<a href="https://amnation.netlify.app/" target="_blank" class="link-cyan">amnation.netlify.app</a>): High-conversion commercial business website built for brand presence and mobile responsiveness.</li>
        <li><strong>Shooins</strong> (<a href="https://shooins.netlify.app/" target="_blank" class="link-cyan">shooins.netlify.app</a>): B2B wholesale platform for hair-accessories supplier with catalog and lead funnels.</li>
        <li><strong>Saimahima Stays</strong> (<a href="https://saimahimastays.site/" target="_blank" class="link-cyan">saimahimastays.site</a>): Hospitality showcase website with custom domain and accommodation reservations.</li>
      </ol>`
    },
    {
      keywords: ['tradex', 'trading', 'algo', 'bot', 'scalp', 'finance'],
      title: 'Tradex Algorithmic Trading Bot',
      tool: 'INVOKE_QUANT_MODULE: tradex_scalper_report()',
      response: `<strong>Tradex Scalper Bot Engine:</strong>
      <br><br>
      <ul>
        <li><strong>Indicator Suite:</strong> EMA (Exponential Moving Average), ADX (Trend Strength), VWAP (Volume Weighted Average Price), RSI (Momentum), and fractal breakouts.</li>
        <li><strong>Automation:</strong> Automated order state machine with structured error catching, execution logging, and risk stop parameters.</li>
        <li><strong>Market Documentation:</strong> Research-backed explainers and performance backtesting reports.</li>
      </ul>`
    },
    {
      keywords: ['cert', 'certificate', 'coursera', 'be10x', 'outskill', 'wscube', '92%', 'education'],
      title: 'Verified Credentials & Academic Records',
      tool: 'VAULT_VERIFY: fetch_accreditations()',
      response: `<strong>Authenticated Accreditations:</strong>
      <br><br>
      <ul>
        <li><strong>Coursera / UST:</strong> <em>Create Your First Python Program From UST</em> (Nov 8, 2025) — ID: <code>PGV6TNVKMS4R</code></li>
        <li><strong>be10x:</strong> <em>AI Tools and ChatGPT Workshop</em> (April 13, 2025) — Presentation, data analysis, and code debugging.</li>
        <li><strong>Outskill:</strong> <em>Generative AI Mastermind</em> Certificate of Completion.</li>
        <li><strong>WsCube Tech:</strong> <em>How To Become A Top Full Stack Developer In 2026</em>.</li>
        <li><strong>Cathedral College, Jhansi:</strong> Class 10 Computer Science — <strong>92% (School Highest Top Scorer)</strong>; currently Class 12 Science (ISC 2026).</li>
      </ul>`
    },
    {
      keywords: ['contact', 'hire', 'email', 'phone', 'reach', 'whatsapp', 'github'],
      title: 'Direct Communication Coordinates',
      tool: 'COMM_GATEWAY: fetch_contact_channels()',
      response: `<strong>Connect with Ayaan Singh Parihar:</strong>
      <br><br>
      <ul>
        <li><strong>Email:</strong> <a href="mailto:anshparihar345@gmail.com" class="link-cyan">anshparihar345@gmail.com</a></li>
        <li><strong>Phone / WhatsApp:</strong> <a href="tel:+919236447300" class="link-cyan">+91 9236447300</a></li>
        <li><strong>Location:</strong> Jhansi, Uttar Pradesh, India 284003</li>
        <li><strong>GitHub:</strong> <a href="https://github.com/Void-Ayaan" target="_blank" class="link-cyan">github.com/Void-Ayaan</a></li>
        <li><strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/ansh-parihar-23b681387" target="_blank" class="link-cyan">linkedin.com/in/ansh-parihar-23b681387</a></li>
        <li><strong>Instagram Brand:</strong> <a href="https://www.instagram.com/techmonade/" target="_blank" class="link-cyan">@techmonade</a></li>
      </ul>`
    }
  ];

  function handleBuddyQuery(promptText) {
    if (!promptText || !promptText.trim()) return;

    // Append user message
    const userMsgHtml = `
      <div class="chat-msg user-msg">
        <div class="msg-sender"><span class="user-badge">VISITOR</span> <span class="msg-time">Now</span></div>
        <div class="msg-bubble">${escapeHtml(promptText)}</div>
      </div>
    `;
    hudChatLogs.insertAdjacentHTML('beforeend', userMsgHtml);
    hudChatLogs.scrollTop = hudChatLogs.scrollHeight;

    // Find answer
    const lower = promptText.toLowerCase();
    let match = knowledgeBase.find((item) =>
      item.keywords.some((kw) => lower.includes(kw))
    );

    if (!match) {
      match = {
        title: 'Buddy AI Knowledge Retrieval',
        tool: 'NEURAL_FALLBACK: query_local_context()',
        response: `I analyzed your query: <em>"${escapeHtml(promptText)}"</em>. Ayaan is an entry-level Web Developer and AI Systems Engineer with practical achievements in local offline LLMs (Qwen3-1.7B GGUF), cybersecurity, algorithmic trading bots (Tradex), and full-stack web platforms (AM Nation, Shooins, Saimahima Stays).
        <br><br>
        Feel free to ask about his <strong>projects</strong>, <strong>Buddy AI architecture</strong>, <strong>certifications</strong>, or <strong>contact info</strong>!`
      };
    }

    // Append tool execution spinner
    const toolExecId = 'tool-exec-' + Date.now();
    const toolHtml = `
      <div id="${toolExecId}" class="hud-tool-exec">
        <span class="exec-spinner"></span>
        <span>${match.tool}</span>
      </div>
    `;
    hudChatLogs.insertAdjacentHTML('beforeend', toolHtml);
    hudChatLogs.scrollTop = hudChatLogs.scrollHeight;
    audio.playType();

    // Telemetry pulse
    const cpuEl = document.getElementById('cpu-percent');
    const ramEl = document.getElementById('ram-percent');
    if (cpuEl) cpuEl.textContent = Math.floor(Math.random() * 25 + 35) + '%';
    if (ramEl) ramEl.textContent = '68%';

    setTimeout(() => {
      const toolBox = document.getElementById(toolExecId);
      if (toolBox) toolBox.remove();

      const botMsgHtml = `
        <div class="chat-msg bot-msg">
          <div class="msg-sender"><span class="bot-badge">BUDDY AI</span> <span class="msg-time">Response Dispatched</span></div>
          <div class="msg-bubble">${match.response}</div>
        </div>
      `;
      hudChatLogs.insertAdjacentHTML('beforeend', botMsgHtml);
      hudChatLogs.scrollTop = hudChatLogs.scrollHeight;
      audio.playChime();
    }, 700);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  if (hudForm) {
    hudForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = hudInput.value;
      hudInput.value = '';
      handleBuddyQuery(val);
    });
  }

  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const p = chip.dataset.prompt;
      handleBuddyQuery(p);
    });
  });

  // ==========================================================================
  // 9. INTERACTIVE HACKER TERMINAL (HOTKEY: ~)
  // ==========================================================================
  const termModal = document.getElementById('terminal-modal');
  const termInput = document.getElementById('term-input');
  const termOutput = document.getElementById('term-output');
  const termTrigger = document.getElementById('terminal-trigger-btn');
  const heroQuickTerm = document.getElementById('hero-quick-terminal');
  const mobileTermTrigger = document.getElementById('mobile-terminal-trigger');
  const termCloseBtn = document.getElementById('terminal-close-btn');
  const termCloseDot = document.getElementById('terminal-close-dot');
  const termClearBtn = document.getElementById('terminal-clear-btn');

  function openTerminal() {
    if (termModal) {
      termModal.classList.add('open');
      audio.playChime();
      setTimeout(() => termInput && termInput.focus(), 150);
    }
  }

  function closeTerminal() {
    if (termModal) {
      termModal.classList.remove('open');
      audio.playClick();
    }
  }

  if (termTrigger) termTrigger.addEventListener('click', openTerminal);
  if (heroQuickTerm) heroQuickTerm.addEventListener('click', openTerminal);
  if (mobileTermTrigger) mobileTermTrigger.addEventListener('click', openTerminal);
  if (termCloseBtn) termCloseBtn.addEventListener('click', closeTerminal);
  if (termCloseDot) termCloseDot.addEventListener('click', closeTerminal);
  if (termClearBtn) {
    termClearBtn.addEventListener('click', () => {
      termOutput.innerHTML = '';
      audio.playClick();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === '`' || e.key === '~') {
      if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        if (termModal.classList.contains('open')) {
          closeTerminal();
        } else {
          openTerminal();
        }
      }
    } else if (e.key === 'Escape') {
      closeTerminal();
      closeAllModals();
    }
  });

  if (termInput) {
    termInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = termInput.value.trim();
        termInput.value = '';
        executeTermCommand(cmd);
      }
    });
  }

  function executeTermCommand(cmdStr) {
    audio.playType();
    const cleanCmd = cmdStr.toLowerCase().trim();

    // Echo input
    const echoLine = document.createElement('div');
    echoLine.className = 'term-line cmd-echo';
    echoLine.innerHTML = `<span class="term-ps1"><span class="ps1-user">void-ayaan</span>@<span class="ps1-host">hub</span>:<span class="ps1-path">~</span>$</span> ${escapeHtml(cmdStr)}`;
    termOutput.appendChild(echoLine);

    const outLine = document.createElement('div');
    outLine.className = 'term-line';

    switch (cleanCmd) {
      case 'help':
        outLine.innerHTML = `
Available Terminal Commands:
  <span class="term-highlight">bio</span>       - Print Ayaan Singh Parihar's engineering profile
  <span class="term-highlight">projects</span>  - List shipped projects & systems
  <span class="term-highlight">skills</span>    - Output technical stack & language capabilities
  <span class="term-highlight">certs</span>     - Display verified certifications & credentials
  <span class="term-highlight">buddy</span>     - Query the local Buddy AI system
  <span class="term-highlight">contact</span>   - Print direct contact coordinates
  <span class="term-highlight">matrix</span>    - Run Matrix digital rain animation
  <span class="term-highlight">clear</span>     - Clear terminal buffer
  <span class="term-highlight">exit</span>      - Close terminal session`;
        break;

      case 'bio':
      case 'whoami':
        outLine.innerHTML = `
Ayaan Singh Parihar (Void-Ayaan)
- Field: AI Systems Engineering, Cybersecurity, Full-Stack Web, Algorithmic Trading
- Location: Jhansi, Uttar Pradesh, India 284003
- Education: Cathedral College, Jhansi (ISC Class 12 Science 2026; Class 10 CS: 92% School Highest)
- Summary: Entry-level Web Developer and Systems Creator building local offline AI assistants (Qwen3-1.7B GGUF), algo trading scalpers, and commercial web applications.`;
        break;

      case 'projects':
        outLine.innerHTML = `
[01] Buddy AI System        - Local Windows Assistant (Qwen3-1.7B GGUF, llamafile, 10/10 Tool Calling)
[02] Tradex Algo Bot        - Scalping Bot (EMA, ADX, VWAP, RSI, Fractals, Automated Execution)
[03] AM Nation              - Commercial Business Website (amnation.netlify.app)
[04] Shooins                - Wholesale B2B Hair Accessories Supplier (shooins.netlify.app)
[05] Saimahima Stays        - Hospitality Web Experience (saimahimastays.site)
[06] Techmonade             - Desk Setup & Peripheral Tech Brand (instagram.com/techmonade)
[07] Passive Buddy          - Telegram Gig Automation Bot
[08] Absorption Engine      - Offline JSON Knowledge Ingestion Architecture`;
        break;

      case 'skills':
        outLine.innerHTML = `
Core Systems & Tech Stack:
- AI & LLMs:        Qwen3-1.7B GGUF, llamafile, Tool Pipelines, JSON Brain Stores, Windows SAPI
- Cybersecurity:    Ethical Hacking, Incident Response, Network Traffic Basics, Linux, Bash
- Web Development:  HTML5, CSS3, JavaScript (ES6+), React, Vite, Tailwind CSS, shadcn/ui
- Programming:      Java (OOP, DSA, Searching/Sorting), Python Automation, Playwright, REST APIs
- Finance/Trading:  Scalping Strategies, EMA, RSI, VWAP, ADX, Fractals, Automated Logs`;
        break;

      case 'certs':
        outLine.innerHTML = `
Verified Certifications & Honors:
[✓] Coursera & UST: Create Your First Python Program From UST (ID: PGV6TNVKMS4R)
[✓] be10x: AI Tools and ChatGPT Workshop (April 13, 2025)
[✓] Outskill: Generative AI Mastermind
[✓] WsCube Tech: How To Become A Top Full Stack Developer In 2026
[★] Cathedral College Jhansi: 92% in 10th Computer Science (School Highest Record)`;
        break;

      case 'contact':
        outLine.innerHTML = `
Communication Coordinates:
- Email:     anshparihar345@gmail.com
- Phone:     +91 9236447300
- GitHub:    https://github.com/Void-Ayaan
- LinkedIn:  https://www.linkedin.com/in/ansh-parihar-23b681387
- Instagram: https://www.instagram.com/techmonade/`;
        break;

      case 'matrix':
        outLine.innerHTML = `<span style="color:#00ff88;">[INITIATING MATRIX DIGITAL STREAM]...</span>`;
        runMatrixRain();
        break;

      case 'buddy':
        outLine.innerHTML = `Buddy AI v2.4 initialized. System online. Quantization: GGUF 4_K_M. Head over to Section 03 on the page for live interactive query dispatch.`;
        break;

      case 'clear':
        termOutput.innerHTML = '';
        return;

      case 'exit':
      case 'quit':
        closeTerminal();
        return;

      case '':
        return;

      default:
        outLine.innerHTML = `bash: command not found: <span style="color:#ef4444;">${escapeHtml(cleanCmd)}</span>. Type <span class="term-highlight">'help'</span> for instructions.`;
        break;
    }

    termOutput.appendChild(outLine);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function runMatrixRain() {
    let count = 0;
    const interval = setInterval(() => {
      const line = document.createElement('div');
      line.className = 'term-line';
      let str = '';
      for (let i = 0; i < 48; i++) {
        str += String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96)) + ' ';
      }
      line.style.color = '#00ff88';
      line.style.fontSize = '0.72rem';
      line.textContent = str;
      termOutput.appendChild(line);
      termOutput.scrollTop = termOutput.scrollHeight;
      count++;
      if (count > 18) clearInterval(interval);
    }, 90);
  }

  // ==========================================================================
  // 10. CERTIFICATE LIGHTBOX MODAL
  // ==========================================================================
  const certModal = document.getElementById('cert-modal');
  const certModalContent = document.getElementById('cert-modal-content');
  const certModalClose = document.getElementById('cert-modal-close');
  const viewCertBtns = document.querySelectorAll('.view-cert-btn');

  const certData = {
    be10x: {
      seal: '🏅',
      title: 'AI Tools & ChatGPT Workshop',
      issuer: 'be10x &bull; Aditya Goenka & Aditya Kachave',
      date: 'April 13th, 2025',
      desc: 'Certified completion of hands-on generative AI masterclass covering presentation creation under 5 minutes, complex dataset analysis under 30 minutes, and rapid AI-assisted software debugging under 10 minutes.',
      credId: 'BE10X-VERIFIED-AI-2025',
      linkText: null
    },
    coursera: {
      seal: '📜',
      title: 'Create Your First Python Program From UST',
      issuer: 'Authorized by Coursera & Offered through UST (Instructor: Amit Yadav)',
      date: 'November 8th, 2025',
      desc: 'Online non-credit project authorized by Coursera and offered through UST. Rigorous certification of Python fundamentals, control structures, and programmatic logic.',
      credId: 'PGV6TNVKMS4R',
      linkUrl: 'https://coursera.org/verify/PGV6TNVKMS4R',
      linkText: 'Verify on Coursera Official Portal ↗'
    },
    outskill: {
      seal: '🎓',
      title: 'Generative AI Mastermind',
      issuer: 'Outskill',
      date: 'Credential of Mastery',
      desc: 'In-depth specialization in generative model prompt chaining, autonomous agent workflows, tool orchestration, and LLM implementation pipelines.',
      credId: 'OUTSKILL-GENAI-MASTERY',
      linkText: null
    },
    wscube: {
      seal: '💻',
      title: 'How To Become A Top Full Stack Developer In 2026',
      issuer: 'WsCube Tech &bull; Certificate of Participation',
      date: 'January 2026',
      desc: 'Participation certificate evaluating 2026 state-of-the-art full stack development paradigms, API engineering, modern UI architecture, and deployment pipelines.',
      credId: 'WSCUBE-TECH-FSD-2026',
      linkText: null
    }
  };

  viewCertBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const certKey = btn.dataset.cert;
      const data = certData[certKey];
      if (!data) return;

      certModalContent.innerHTML = `
        <div class="cert-modal-body-rendered">
          <div class="cert-seal">${data.seal}</div>
          <h3 class="cert-modal-title">${data.title}</h3>
          <div class="cert-modal-recipient">Awarded to AYAAN SINGH PARIHAR</div>
          <p class="cert-issuer">${data.issuer}</p>
          <div class="cert-date">${data.date}</div>
          <p class="cert-modal-desc">${data.desc}</p>
          <div class="cert-credential-box">
            <span>Credential Verification Code:</span>
            <code>${data.credId}</code>
          </div>
          ${data.linkUrl ? `<a href="${data.linkUrl}" target="_blank" rel="noopener noreferrer" class="cyber-btn cyber-btn-primary btn-sm">${data.linkText}</a>` : ''}
        </div>
      `;

      certModal.classList.add('open');
      audio.playChime();
    });
  });

  if (certModalClose) {
    certModalClose.addEventListener('click', () => {
      certModal.classList.remove('open');
      audio.playClick();
    });
  }

  // ==========================================================================
  // 11. PROJECT ARCHITECTURE DEEP DIVE MODAL
  // ==========================================================================
  const projectModal = document.getElementById('project-modal');
  const projectModalContent = document.getElementById('project-modal-content');
  const projectModalClose = document.getElementById('project-modal-close');
  const viewProjectBtns = document.querySelectorAll('.view-details-btn');

  const projectDetails = {
    'buddy-ai': {
      title: 'Buddy AI System — Local Desktop Assistant Specification',
      tag: 'LOCAL INTELLIGENCE // QWEN3-1.7B GGUF',
      img: 'assets/images/buddy_ai.jpg',
      content: `
        <p><strong>Overview:</strong> Buddy AI is an offline-first Windows desktop assistant designed to combine the privacy and responsiveness of local LLMs with an extensible direct-action tool calling registry.</p>
        <br>
        <h4>Key Technical Highlights:</h4>
        <ul style="padding-left:1.2rem; margin: 0.5rem 0 1rem 0; color:var(--text-muted); font-size:0.9rem;">
          <li><strong>Offline Model Server:</strong> Quantized Qwen3-1.7B in GGUF format executed through a local <code>llamafile</code> server with 0ms external API latency.</li>
          <li><strong>Request Pipeline Architecture:</strong> Layered request routing separating instant cached greetings, deterministic utility tools (calculator, calendar, time), factual knowledge, and model-routed actions.</li>
          <li><strong>Tool Calling Benchmark:</strong> Achieved 10/10 correct execution on a fixed tool-calling test set.</li>
          <li><strong>Telemetry HUD:</strong> Real-time hardware telemetry display tracking CPU load, RAM allocation, battery levels, and activity streams.</li>
          <li><strong>Voice Synthesis:</strong> Integrated Windows SAPI speech output and a configurable proactive speech scheduler for periodic updates.</li>
        </ul>
        <div style="margin-top:1.2rem;">
          <a href="#buddy-hud" class="cyber-btn cyber-btn-primary btn-sm" onclick="document.getElementById('project-modal').classList.remove('open')">Test Live HUD Console ↗</a>
        </div>
      `
    },
    'tradex': {
      title: 'Tradex — Algorithmic Trading Bot Strategy',
      tag: 'QUANT STRATEGY // SCALPER ENGINE',
      img: 'assets/images/tradex.jpg',
      content: `
        <p><strong>Overview:</strong> Tradex is an automated scalping bot architecture developed to study and execute quantitative strategies on fast-moving financial instruments.</p>
        <br>
        <h4>Strategy & Risk Rules:</h4>
        <ul style="padding-left:1.2rem; margin: 0.5rem 0 1rem 0; color:var(--text-muted); font-size:0.9rem;">
          <li><strong>Multi-Indicator Confluence:</strong> Combines Exponential Moving Averages (EMA 20/50), Average Directional Index (ADX) for trend conviction, Volume Weighted Average Price (VWAP), and RSI overbought/oversold levels.</li>
          <li><strong>Fractal Breakouts:</strong> Uses fractal turning points to identify stop placements and scalp trigger targets.</li>
          <li><strong>Automated Execution Logging:</strong> Complete structured logging pipeline capturing order entry, slippage, profit targets, and execution latency.</li>
          <li><strong>Market Research:</strong> Includes written explainers simplifying quantitative finance concepts for engineers and researchers.</li>
        </ul>
      `
    },
    'amnation': {
      title: 'AM Nation — Commercial Business Website',
      tag: 'CLIENT PLATFORM // PRODUCTION',
      content: `
        <p><strong>Overview:</strong> AM Nation is a published commercial business website designed for optimal visual storytelling, fast load speeds, and clear service presentation.</p>
        <br>
        <h4>Implementation Details:</h4>
        <ul style="padding-left:1.2rem; margin: 0.5rem 0 1rem 0; color:var(--text-muted); font-size:0.9rem;">
          <li>Responsive multi-device layout architecture.</li>
          <li>Custom styling with performance-first CSS.</li>
          <li>Continuous deployment via Netlify CDN.</li>
          <li>Live URL: <a href="https://amnation.netlify.app/" target="_blank" class="link-cyan">amnation.netlify.app</a></li>
        </ul>
        <div style="margin-top:1.2rem;">
          <a href="https://amnation.netlify.app/" target="_blank" class="cyber-btn cyber-btn-primary btn-sm">Visit Live Website ↗</a>
        </div>
      `
    },
    'shooins': {
      title: 'Shooins — Wholesale B2B Supplier Website',
      tag: 'B2B PLATFORM // CATALOG',
      content: `
        <p><strong>Overview:</strong> Built for a wholesale hair-accessories supplier serving B2B commercial buyers and salons.</p>
        <br>
        <h4>Implementation Details:</h4>
        <ul style="padding-left:1.2rem; margin: 0.5rem 0 1rem 0; color:var(--text-muted); font-size:0.9rem;">
          <li>Structured wholesale product catalog presentation.</li>
          <li>Supplier credentials, bulk pricing information architecture, and lead generation pathways.</li>
          <li>Live URL: <a href="https://shooins.netlify.app/" target="_blank" class="link-cyan">shooins.netlify.app</a></li>
        </ul>
        <div style="margin-top:1.2rem;">
          <a href="https://shooins.netlify.app/" target="_blank" class="cyber-btn cyber-btn-primary btn-sm">Visit Live Website ↗</a>
        </div>
      `
    },
    'saimahima': {
      title: 'Saimahima Stays — Hospitality Web Experience',
      tag: 'HOSPITALITY // CUSTOM DOMAIN',
      content: `
        <p><strong>Overview:</strong> Premium hospitality showcase website deployed on a custom domain for a homestay business.</p>
        <br>
        <h4>Implementation Details:</h4>
        <ul style="padding-left:1.2rem; margin: 0.5rem 0 1rem 0; color:var(--text-muted); font-size:0.9rem;">
          <li>Immersive visual presentation with photo galleries and room amenity highlights.</li>
          <li>Guest reservation inquiry funnels and location guide.</li>
          <li>Live URL: <a href="https://saimahimastays.site/" target="_blank" class="link-cyan">saimahimastays.site</a></li>
        </ul>
        <div style="margin-top:1.2rem;">
          <a href="https://saimahimastays.site/" target="_blank" class="cyber-btn cyber-btn-primary btn-sm">Visit Live Website ↗</a>
        </div>
      `
    },
    'techmonade': {
      title: 'Techmonade & Social Media Auto-Posting Workflow',
      tag: 'CONTENT BRAND & AUTOMATION',
      content: `
        <p><strong>Overview:</strong> Techmonade is a technology-focused digital media brand centered on aesthetic desk setups, mechanical keyboards, and workspace peripherals.</p>
        <br>
        <h4>Content & Automation Pipeline:</h4>
        <ul style="padding-left:1.2rem; margin: 0.5rem 0 1rem 0; color:var(--text-muted); font-size:0.9rem;">
          <li>Short-form video editing: clip sequencing, beat-synchronized cuts, transitions, captions, and product-focused storytelling.</li>
          <li>Python & Playwright browser-automation workflow for publishing short-form clips directly from local storage with caption presets.</li>
          <li>Instagram Channel: <a href="https://www.instagram.com/techmonade/" target="_blank" class="link-cyan">@techmonade</a></li>
        </ul>
        <div style="margin-top:1.2rem;">
          <a href="https://www.instagram.com/techmonade/" target="_blank" class="cyber-btn cyber-btn-primary btn-sm">View Instagram Brand ↗</a>
        </div>
      `
    },
    'passive-buddy': {
      title: 'Project Passive Buddy / Sleep2EarnBot',
      tag: 'TELEGRAM AUTOMATION BOT',
      content: `
        <p><strong>Overview:</strong> AI-powered gig automation workflow orchestrating generative media tools (Canva, Runway, ChatGPT) with a Telegram bot interface for autonomous service delivery.</p>
      `
    },
    'absorption-engine': {
      title: 'Absorption Engine & Offline JSON Brain',
      tag: 'KNOWLEDGE INGESTION ARCHITECTURE',
      content: `
        <p><strong>Overview:</strong> Technical documentation and implementation of an offline knowledge storage system utilizing structured JSON for local LLMs, preserving session context and continuous factual absorption.</p>
      `
    }
  };

  viewProjectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const pKey = btn.dataset.project;
      const data = projectDetails[pKey];
      if (!data) return;

      projectModalContent.innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--neon-cyan);">${data.tag}</span>
          <h3 style="font-family:var(--font-display); font-size:1.5rem; color:#ffffff; margin:0.4rem 0 1rem 0;">${data.title}</h3>
          ${data.img ? `<img src="${data.img}" alt="${data.title}" style="width:100%; border-radius:8px; margin-bottom:1.2rem; border:1px solid rgba(0,240,255,0.2);">` : ''}
          ${data.content}
        </div>
      `;

      projectModal.classList.add('open');
      audio.playChime();
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', () => {
      projectModal.classList.remove('open');
      audio.playClick();
    });
  }

  // ==========================================================================
  // 12. FULL EXECUTIVE RESUME MODAL & PRINT / PDF EXPORT
  // ==========================================================================
  const resumeModal = document.getElementById('resume-modal');
  const viewResumeBtn = document.getElementById('view-resume-btn');
  const mobileResumeTrigger = document.getElementById('mobile-resume-trigger');
  const resumeModalClose = document.getElementById('resume-modal-close');
  const resumePrintBtn = document.getElementById('resume-print-btn');

  function openResume() {
    if (resumeModal) {
      resumeModal.classList.add('open');
      audio.playChime();
    }
  }

  if (viewResumeBtn) viewResumeBtn.addEventListener('click', openResume);
  if (mobileResumeTrigger) mobileResumeTrigger.addEventListener('click', openResume);
  if (resumeModalClose) {
    resumeModalClose.addEventListener('click', () => {
      resumeModal.classList.remove('open');
      audio.playClick();
    });
  }
  if (resumePrintBtn) {
    resumePrintBtn.addEventListener('click', () => {
      audio.playClick();
      window.print();
    });
  }

  // ==========================================================================
  // 13. 1-CLICK COPY WITH TOAST NOTIFICATION
  // ==========================================================================
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Copied! ✓</span>';
        btn.classList.add('copied');
        audio.playChime();
        audio.showToast(`Copied to Clipboard: ${textToCopy}`);

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove('copied');
        }, 2200);
      });
    });
  });

  // ==========================================================================
  // 14. TRANSMISSION FORM HANDLER (SIMULATED SECURE DISPATCH)
  // ==========================================================================
  const contactForm = document.getElementById('contact-transmission-form');
  const formStatus = document.getElementById('form-status-alert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      audio.playClick();

      const name = document.getElementById('sender-name').value;
      const email = document.getElementById('sender-email').value;
      const subject = document.getElementById('sender-subject').value;
      const msg = document.getElementById('sender-message').value;

      formStatus.className = 'form-status-alert success';
      formStatus.innerHTML = `
        <strong>TRANSMISSION ENCRYPTED &amp; DISPATCHED!</strong><br>
        Thank you, <em>${escapeHtml(name)}</em>. Your payload regarding <em>"${escapeHtml(subject)}"</em> has been queued. Ayaan will reply to <em>${escapeHtml(email)}</em> promptly.
      `;

      // Trigger mailto fallback link in background
      const mailtoLink = `mailto:anshparihar345@gmail.com?subject=${encodeURIComponent('[Portfolio Transmission] ' + subject)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + msg)}`;
      
      const submitBtn = contactForm.querySelector('.transmit-submit-btn');
      if (submitBtn) {
        submitBtn.innerHTML = `<span>Transmission Sent ✓</span>`;
        submitBtn.disabled = true;
      }

      audio.playChime();

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.innerHTML = `<span>Dispatch Transmission to Ayaan</span>`;
          submitBtn.disabled = false;
        }
      }, 5000);
    });
  }

  // ==========================================================================
  // 15. MOBILE DRAWER NAVIGATION
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerClose = document.getElementById('mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function closeMobileDrawer() {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      mobileDrawer.classList.remove('open');
      audio.playClick();
    }
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      audio.playClick();
    });

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', closeMobileDrawer);
    }

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeMobileDrawer();
      }
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });

    if (mobileTermTrigger) {
      mobileTermTrigger.addEventListener('click', () => {
        closeMobileDrawer();
        openTerminal();
      });
    }

    if (mobileResumeTrigger) {
      mobileResumeTrigger.addEventListener('click', () => {
        closeMobileDrawer();
        openResume();
      });
    }
  }

  // Helper to close all open modals
  function closeAllModals() {
    [termModal, certModal, projectModal, resumeModal].forEach((m) => {
      if (m) m.classList.remove('open');
    });
  }

  // Close modals on overlay backdrop click
  [termModal, certModal, projectModal, resumeModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('open');
          audio.playClick();
        }
      });
    }
  });

  // Smooth scrollspy for nav links (throttled with rAF for 60/120fps performance)
  const sections = document.querySelectorAll('section[id]');
  let isScrolling = false;

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        sections.forEach((current) => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 120;
          const sectionId = current.getAttribute('id');
          const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            if (navLink) navLink.classList.add('active');
          } else {
            if (navLink) navLink.classList.remove('active');
          }
        });
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  // Avatar Portrait Switcher (Cyber Studio <-> Filmic Grade <-> Raw Photo)
  const avatarToggleBtn = document.getElementById('avatar-toggle-btn');
  const mainAvatarImg = document.getElementById('main-avatar-img');
  const avatarModeLabel = document.getElementById('avatar-mode-label');

  if (avatarToggleBtn && mainAvatarImg && avatarModeLabel) {
    const portraitModes = [
      {
        src: 'assets/images/ayaan_cyber_portrait.jpg',
        label: 'Cyber Studio',
        hint: '⇄ Filmic Grade',
        toast: 'Mode: Cyber Studio Portrait (Cinematic Neon Rim)'
      },
      {
        src: 'assets/images/ayaan_graded.jpg',
        label: 'Filmic Grade',
        hint: '⇄ Raw Photo',
        toast: 'Mode: Filmic Color Graded Real Photo'
      },
      {
        src: 'assets/images/ayaan_real.jpg',
        label: 'Raw Photo',
        hint: '⇄ Cyber Studio',
        toast: 'Mode: Original Raw Photo'
      }
    ];

    let currentModeIdx = 0;

    avatarToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentModeIdx = (currentModeIdx + 1) % portraitModes.length;
      const mode = portraitModes[currentModeIdx];
      audio.playChime();

      mainAvatarImg.style.opacity = '0';
      mainAvatarImg.style.transform = 'scale(0.92)';

      setTimeout(() => {
        mainAvatarImg.src = mode.src;
        avatarModeLabel.textContent = mode.label;
        const hintEl = avatarToggleBtn.querySelector('.switch-hint');
        if (hintEl) hintEl.textContent = mode.hint;
        audio.showToast(mode.toast);

        // Also sync resume photo
        const resumePhoto = document.querySelector('.cr-photo');
        if (resumePhoto) resumePhoto.src = mode.src;

        mainAvatarImg.style.opacity = '1';
        mainAvatarImg.style.transform = 'scale(1)';
      }, 180);
    });
  }

});

