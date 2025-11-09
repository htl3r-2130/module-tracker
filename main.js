let data = {};
let currentSubject = "WEBT";

async function loadData() {
  const res = await fetch("./data/progress.json");
  const json = await res.json();

  // Merge with localStorage progress if present
  const saved = localStorage.getItem("progress");
  if (saved) {
    const savedData = JSON.parse(saved);
    mergeProgress(json, savedData);
  }

  data = json;
  renderSubject(currentSubject);
}

function mergeProgress(base, saved) {
  for (const subject in base) {
    ["core", "adv"].forEach(type => {
      base[subject][type].forEach((task, i) => {
        if (saved[subject]?.[type]?.[i]) {
          Object.assign(task, saved[subject][type][i]);
        }
      });
    });
  }
}

function saveProgress() {
  localStorage.setItem("progress", JSON.stringify(data));
}

function switchSubject(subj) {
  currentSubject = subj;
  renderSubject(subj);
}

function renderSubject(subj) {
  const container = document.getElementById("subject-container");
  const subject = data[subj];
  container.innerHTML = `
    <h2>${subj}</h2>
    <p><strong>Core:</strong> ${countDone(subject.core)} / ${subject.core.length}</p>
    <p><strong>Advanced:</strong> ${countDone(subject.adv)} / ${subject.adv.length}</p>
    <div class="task-list">
      <h3>Core Modules</h3>
      ${renderTasks(subject.core, subj, "core")}
      <h3>Advanced Modules</h3>
      ${renderTasks(subject.adv, subj, "adv")}
    </div>
  `;
}

function renderTasks(tasks, subj, type) {
  return tasks.map((t, i) => `
    <div class="task ${t.conversation && t.quiz ? "done" : ""}">
      <span>${t.id ? t.id + " - " : ""}${t.title}</span>
      <span>
        <label>Gespräch <input type="checkbox" ${t.conversation ? "checked" : ""} onchange="toggle('${subj}', '${type}', ${i}, 'conversation')"></label>
        <label>Quiz <input type="checkbox" ${t.quiz ? "checked" : ""} onchange="toggle('${subj}', '${type}', ${i}, 'quiz')"></label>
      </span>
    </div>
  `).join("");
}

function toggle(subj, type, i, key) {
  data[subj][type][i][key] = !data[subj][type][i][key];
  saveProgress();
  renderSubject(subj);
}

function countDone(tasks) {
  return tasks.filter(t => t.conversation && t.quiz).length;
}

loadData();
