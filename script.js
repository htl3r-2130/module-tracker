const subjects = {
  "WEBT": {
    coreRequiredSemester: 4,
    coreRequiredYear: 8,
    advImproveSemester: [1,2,4],
    advImproveYear: [2,4,8],
    maxCoreCount: 8,
    maxAdvCount: 8,
    tasks: [
          ["CORE", "01", "Docker"],
          ["CORE", "02", "Object Oriented PHP with Version Control"],
          ["CORE", "03", "Web Services with Plain PHP and JavaScript"],
          ["CORE", "04", "Composer and Views in MVC"],
          ["CORE", "05", "Sessions and Cookies"],
          ["CORE", "06", "Symfony - Webservice with basic VC"],
          ["CORE", "07", "Symfony - Using Doctrine ORM for persistence"],
          ["CORE", "08", "Erste Schritte mit TYPO3"],
          ["ADV", "", "CI/CD mit Github"],
          ["ADV", "", "Basic Unit Tests in PHP"],
          ["ADV", "", "Coding Standards"],
          ["ADV", "", "Composer in TYPO3"],
          ["ADV", "", "Fluid Templating Engine"],
          ["ADV", "", "GIT Expert"],
          ["ADV", "", "Git Workflows"],
          ["ADV", "", "OpenAPI"],
          ["ADV", "", "PHP Documentation"],
          ["ADV", "", "Redis"],
          ["ADV", "", "Responsive Websites with SASS"],
          ["ADV", "", "Speaking URLs for websites"],
          ["ADV", "", "Swagger"],
          ["ADV", "", "Symfony - Extending Twig"],
          ["ADV", "", "Symfony - Security"],
          ["ADV", "", "Symfony - Translations and Localized Routes"],
          ["ADV", "", "Symfony - Validation"],
          ["ADV", "", "Twig Templating Engine"],
          ["ADV", "", "TYPO3 Backend Module erstellen"],
          ["ADV", "", "TYPO3 Barrierefreiheit"],
          ["ADV", "", "TYPO3 Benutzergruppen"],
          ["ADV", "", "TYPO3 Bilder mit TypoScript erstellen"],
          ["ADV", "", "TYPO3 Extensions einsetzen"],
          ["ADV", "", "TYPO3 Fluid Teil 1"],
          ["ADV", "", "TYPO3 Formulare"],
          ["ADV", "", "TYPO3 MVC"],
          ["ADV", "", "TYPO3 Routing and Redirects"],
          ["ADV", "", "TYPO3 Translations"],
          ["ADV", "", "TYPO3 TypoScript"],
          ["ADV", "", "XDebug"]
    ]
  },
  "SEW": {
    coreRequiredSemester: 5,
    coreRequiredYear: 9,
    advImproveSemester: [1,2,3,4],
    advImproveYear: [2,4,6,8],
    tasks: [
          ["CORE","01","JavaScript Basics 4th Grade"],
          ["CORE","02","JavaScript Working with Objects"],
          ["CORE","03","JavaScript Modules"],
          ["ADV","04","JavaScript Classes"],
          ["CORE","05","Vue App Template"],
          ["CORE","06","Todo App"],
          ["ADV","07","Linting und Debugging vue.js"],
          ["ADV","08","Todo App extended"],
          ["CORE","09","Registrationform"],
          ["CORE","10","IP Address Lookup"],
          ["CORE","11","Recipe Search"],
          ["CORE","12","Webshop"],
          ["ADV","13","vue.js Component Testing"],
          ["ADV","14","i18n for vue.js Projects"],
          ["ADV","15","vue.js Ecosystem & Individual vue.js Project"]
    ]
  },
  "CMS": {
    coreRequiredSemester: 3,
    coreRequiredYear: 5,
    advImproveSemester: [1,2,3,4],
    advImproveYear: [2,4,6,8],
    tasks: [
          ["CORE","01","General Basics"],
          ["CORE","02","Installing WordPress"],
          ["CORE","03","Creating and Managing Content in WordPress"],
          ["CORE","04","Setting up Plugins in WordPress"],
          ["CORE","05","Creating a Custom Theme in WordPress"],
          ["ADV","","Accessibility in WordPress with the help of a plugin"],
          ["ADV","","Caching Optimization in WordPress"],
          ["ADV","","Creating a WordPress Backup Strategy"],
          ["ADV","","Hardening WordPress"],
          ["ADV","","SEO in WordPress with the help of a plugin"],
          ["ADV","","Setting up roles in WordPress"]
    ]
  }
};

const loadProgress = () => JSON.parse(localStorage.getItem("progress") || "{}");
const saveProgress = (data) => localStorage.setItem("progress", JSON.stringify(data));

function getStatus(subject, info, progress) {
  const doneCore = info.tasks.filter(([type, , name]) =>
    type === "CORE" && progress[subject + "_" + name]?.meeting && progress[subject + "_" + name]?.quiz
  ).length;
  const doneAdv = info.tasks.filter(([type, , name]) =>
    type === "ADV" && progress[subject + "_" + name]?.meeting && progress[subject + "_" + name]?.quiz
  ).length;

  let semester = "Nicht positiv";
  let jahr = "Nicht positiv";

  if (doneCore >= info.coreRequiredSemester) {
    semester = "Positiv (4)";
    info.advImproveSemester.forEach((n, i) => {
      if (doneAdv >= n)
        semester = ["Befriedigend (3)", "Gut (2)", "Sehr gut (1)"][i] || semester;
    });
  }

  if (doneCore >= info.coreRequiredYear) {
    jahr = "Positiv (4)";
    info.advImproveYear.forEach((n, i) => {
      if (doneAdv >= n)
        jahr = ["Befriedigend (3)", "Gut (2)", "Sehr gut (1)"][i] || jahr;
    });
  }

  return { doneCore, doneAdv, semester, jahr };
}

/* === Aufgaben-Ansicht === */
function renderTasks() {
  const progress = loadProgress();
  const container = document.getElementById("subjects");
  container.innerHTML = "";

  for (const [subject, info] of Object.entries(subjects)) {
    const div = document.createElement("div");
    div.className = "subject";
    const status = getStatus(subject, info, progress);

    div.innerHTML = `
      <h2>${subject}</h2>
      <div class="chart-container">
        <canvas id="chart_${subject}"></canvas>
      </div>
      <div class="status">Semester: ${status.semester} | Jahr: ${status.jahr}</div>
    `;

    info.tasks.forEach(([type, num, name]) => {
      const key = subject + "_" + name;
      const val = progress[key] || { quiz: false, meeting: false };
      const row = document.createElement("div");
      row.className = "task";
      row.innerHTML = `
        <span class="type">${type}</span>
        <span class="num">${num || ""}</span>
        <label>${name}</label>
        <div class="checkboxes">
          <input type="checkbox" ${val.meeting ? "checked" : ""} data-key="${key}" data-field="meeting" data-subject="${subject}">
          <input type="checkbox" ${val.quiz ? "checked" : ""} data-key="${key}" data-field="quiz" data-subject="${subject}">
        </div>
      `;
      div.appendChild(row);
    });

    container.appendChild(div);

    const ctx = document.getElementById(`chart_${subject}`).getContext("2d");
    const done = info.tasks.filter(([type, , name]) =>
      progress[subject + "_" + name]?.meeting && progress[subject + "_" + name]?.quiz
    ).length;
    const total = info.tasks.length;

    new Chart(ctx, {
      type: "doughnut",
      data: { datasets: [{ data: [done, total - done], backgroundColor: ["#83a4f7", "#ffffffff"], borderWidth: 0 }] },
      options: { cutout: "70%", plugins: { legend: { position: "bottom" } } }
    });
  }

  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.addEventListener("change", e => {
      const key = e.target.dataset.key;
      const field = e.target.dataset.field;
      const subject = e.target.dataset.subject;
      const progress = loadProgress();
      if (!progress[key]) progress[key] = { quiz: false, meeting: false };
      progress[key][field] = e.target.checked;
      saveProgress(progress);
      renderTasks();
    });
  });
}

/* === Dashboard === */
function renderDashboard() {
  const progress = loadProgress();
  const container = document.getElementById("dashboard");
  container.innerHTML = "";

  for (const [subject, info] of Object.entries(subjects)) {
    const status = getStatus(subject, info, progress);
    const card = document.createElement("div");
    card.className = "dash-card";
    card.innerHTML = `
      <h2>${subject}</h2>
      <div class="donut-pair">
        <div class="donut-wrapper">
          <canvas id="sem_${subject}" width="120" height="120"></canvas>
          <div class="donut-label">
            <div>Core: ${status.doneCore}/${info.coreRequiredSemester}</div>
            <div>ADV: ${status.doneAdv}/${info.advImproveSemester.slice(-1)[0]}</div>
          </div>
        </div>
        <div class="donut-wrapper">
          <canvas id="year_${subject}" width="120" height="120"></canvas>
          <div class="donut-label">
            <div>Core: ${status.doneCore}/${info.coreRequiredYear}</div>
            <div>ADV: ${status.doneAdv}/${info.advImproveYear.slice(-1)[0]}</div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);

    new Chart(document.getElementById(`sem_${subject}`), {
      type: "doughnut",
      data: { labels: ["Semester", "Offen"], datasets: [{ data: [Math.min(status.doneCore, info.coreRequiredSemester), info.coreRequiredSemester - Math.min(status.doneCore, info.coreRequiredSemester)], backgroundColor: ["#83a4f7", "#ffffffff"], borderWidth: 0 }] },
      options: { cutout: "70%", plugins: { legend: { display: false } } }
    });

    new Chart(document.getElementById(`year_${subject}`), {
      type: "doughnut",
      data: { labels: ["Jahr", "Offen"], datasets: [{ data: [Math.min(status.doneCore, info.coreRequiredYear), info.coreRequiredYear - Math.min(status.doneCore, info.coreRequiredYear)], backgroundColor: ["#83a4f7", "#ffffffff"], borderWidth: 0 }] },
      options: { cutout: "70%", plugins: { legend: { display: false } } }
    });
  }
}

/* === Navigation === */
const btnTasks = document.getElementById("btnTasks");
const btnDashboard = document.getElementById("btnDashboard");
const viewTasks = document.getElementById("viewTasks");
const viewDashboard = document.getElementById("viewDashboard");

btnTasks.addEventListener("click", () => {
  btnTasks.classList.add("active");
  btnDashboard.classList.remove("active");
  viewTasks.classList.add("active");
  viewDashboard.classList.remove("active");
});

btnDashboard.addEventListener("click", () => {
  btnDashboard.classList.add("active");
  btnTasks.classList.remove("active");
  viewDashboard.classList.add("active");
  viewTasks.classList.remove("active");
  renderDashboard();
});

renderTasks();
