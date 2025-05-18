const defaultTypes = [
  "Bâtiment industriel",
  "Bâtiment",
  "Maison",
  "Chantier",
  "Manoir",
  "Hopital",
  "Inconnu",
  "Blockhaus",
  "Serre",
  "Autre (saisie manuelle)",
];
const defaultRisques = [
  "Aucun risque",
  "Risque inconnu",
  "Risqué (saisie manuelle)",
];
const defaultStatus = [
  "À visiter",
  "Visité",
  "Pas visitable (saisie manuelle)",
];

const defMap = {
  type: defaultTypes,
  risque: defaultRisques,
  status: defaultStatus,
};

// Option type maps
const specialMap = {
  type: "Autre (saisie manuelle)",
  risque: "Risqué (saisie manuelle)",
  status: "Pas visitable (saisie manuelle)",
};
const warningMap = {
  type: "Inconnu",
  risque: "Risque inconnu",
};

function getOptionType(selectId, value) {
  if (value === specialMap[selectId]) return "special";
  if (value === warningMap[selectId]) return "warning";
  return "normal";
}

function getStorageArray(key, def) {
  const saved = JSON.parse(localStorage.getItem(key)) || [];
  const all = [...new Set([...def, ...saved])];

  const unknown = warningMap[key];
  const special = specialMap[key];

  const filtered = all.filter((v) => v !== unknown && v !== special);
  const result = [...filtered];

  if (unknown && all.includes(unknown)) result.push(unknown);
  if (special && all.includes(special)) result.push(special);

  localStorage.setItem(key, JSON.stringify(all));
  return result;
}

function populateSelect(id, values) {
  const select = document.getElementById(id);
  select.innerHTML = "";

  values.forEach((val) => {
    const option = document.createElement("option");
    option.value = val;
    option.textContent = val;

    const type = getOptionType(id, val);
    if (type === "special") option.classList.add("special-option");
    if (type === "warning") option.classList.add("warning-option");

    select.appendChild(option);
  });
}

function toggleTextarea(selectId, textareaId, triggerValue) {
  const select = document.getElementById(selectId);
  const textarea = document.getElementById(textareaId);
  textarea.style.display = select.value === triggerValue ? "block" : "none";
}

function toggleRaisonStatus() {
  toggleTextarea("status", "raisonStatus", specialMap.status);
}
function toggleRisqueRaison() {
  toggleTextarea("risque", "raisonRisque", specialMap.risque);
}
function toggleTypeAutre() {
  toggleTextarea("type", "autreType", specialMap.type);
}

function genererTexte() {
  let status = getValueOrCustom(
    "status",
    "raisonStatus",
    (text) => `Pas visitable (${text})`
  );
  let type = getValueOrCustom("type", "autreType");
  const abandon = document.getElementById("abandon").value;
  let risque = getValueOrCustom(
    "risque",
    "raisonRisque",
    (text) => `Risqué : ${text}`
  );

  const result = `${status}\n- ${type}\n- ${abandon}\n- ${risque}`;
  document.getElementById("outputDisplay").innerText = result;
  document.getElementById("output").value = result;
  document.getElementById("resultBox").style.display = "block";

  copierTexte();

  refreshCustomOptionsList();
}

function getValueOrCustom(selectId, textareaId, formatFn) {
  const select = document.getElementById(selectId);
  let value = select.value;
  if (value === specialMap[selectId]) {
    const customText = document.getElementById(textareaId).value.trim();
    if (customText) {
      value = formatFn ? formatFn(customText) : customText;
      addCustom(selectId, value);
      hideTextarea(textareaId);
    }
  }
  return value;
}

function addCustom(key, value) {
  const defMap = {
    type: defaultTypes,
    risque: defaultRisques,
    status: defaultStatus,
  };

  const saved = JSON.parse(localStorage.getItem(key)) || [];
  if (![...defMap[key], ...saved].includes(value)) {
    saved.push(value);
    localStorage.setItem(key, JSON.stringify(saved));
    populateSelect(key, getStorageArray(key, defMap[key]));
    document.getElementById(key).value = value;
  }
}

function hideTextarea(id) {
  const textarea = document.getElementById(id);
  if (textarea) textarea.style.display = "none";
}

function copierTexte() {
  const text = document.getElementById("output").value;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error("Échec de la copie via Clipboard API", err);
    });
  } else {
    // Fallback pour anciens navigateurs
    const textarea = document.getElementById("output");
    textarea.style.display = "block";
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    textarea.style.display = "none";
  }
}

function refreshCustomOptionsList() {
  const select = document.getElementById("customOptionsList");
  select.innerHTML = "";

  // Récupère toutes les options custom depuis localStorage
  const keys = ["type", "risque", "status"];
  const defMap = {
    type: defaultTypes,
    risque: defaultRisques,
    status: defaultStatus,
  };

  keys.forEach((key) => {
    const saved = JSON.parse(localStorage.getItem(key)) || [];
    saved.forEach((item) => {
      // N'affiche que si ce n'est PAS dans les valeurs par défaut (custom only)
      if (!defMap[key].includes(item)) {
        const option = document.createElement("option");
        option.value = key + "||" + item; // concat pour identifier catégorie + valeur
        option.textContent = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } : "${item}"`;
        select.appendChild(option);
      }
    });
  });

  document.getElementById("deleteCustomBtn").disabled =
    select.options.length === 0;
}

// Supprimer option custom sélectionnée
document.getElementById("deleteCustomBtn").addEventListener("click", () => {
  const select = document.getElementById("customOptionsList");
  const val = select.value;
  if (!val) return;

  const [key, item] = val.split("||");
  if (!key || !item) return;

  let saved = JSON.parse(localStorage.getItem(key)) || [];
  saved = saved.filter((v) => v !== item);
  localStorage.setItem(key, JSON.stringify(saved));

  // Met à jour les selects
  populateSelect(key, getStorageArray(key, defMap[key]));

  // Met à jour la liste custom
  refreshCustomOptionsList();
});

// Désactive bouton si rien sélectionné
document.getElementById("customOptionsList").addEventListener("change", (e) => {
  document.getElementById("deleteCustomBtn").disabled = !e.target.value;
});

// Initialiser la liste à la fin du chargement
window.onload = () => {
  populateSelect("type", getStorageArray("type", defaultTypes));
  populateSelect("risque", getStorageArray("risque", defaultRisques));
  populateSelect("status", getStorageArray("status", defaultStatus));

  refreshCustomOptionsList();
};
