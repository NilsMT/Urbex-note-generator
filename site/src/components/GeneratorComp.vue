<template>
    <div id="generator">
        <h2>Générateur de note d'urbex</h2>

        <!-- Status -->
        <label>Statut :</label>
        <select v-model="selectedStatus">
            <option
                v-for="s in statusList"
                :key="s"
                :value="s"
                :class="generatorStore.isFake(s) ? 'fake' : ''"
            >
                {{ s }}
            </option>
        </select>
        <div class="addCustomContainer">
            <input
                v-if="generatorStore.isFake(selectedStatus)"
                v-model="customStatus"
                placeholder="Veuillez saisir une raison"
            />
            <button
                v-if="generatorStore.isFake(selectedStatus)"
                class="material-symbols-outlined btn btn-normal add-btn"
                @click="addCustomStatus"
                :disabled="!customStatus"
                type="button"
            >
                add
            </button>
        </div>

        <!-- Type -->
        <label>Type :</label>
        <select v-model="selectedType">
            <option
                v-for="t in typeList"
                :key="t"
                :value="t"
                :class="
                    generatorStore.isFake(t)
                        ? 'fake'
                        : generatorStore.isUnknown(t)
                        ? 'unknown'
                        : ''
                "
            >
                {{ t }}
            </option>
        </select>
        <div class="addCustomContainer">
            <input
                v-if="generatorStore.isFake(selectedType)"
                v-model="customType"
                placeholder="Veuillez saisir un type"
            />
            <button
                v-if="generatorStore.isFake(selectedType)"
                class="material-symbols-outlined btn btn-normal add-btn"
                @click="addCustomType"
                :disabled="!customType"
                type="button"
            >
                add
            </button>
        </div>

        <!-- Abandon -->
        <label>Abandon :</label>
        <select v-model="selectedAbandon" id="abandon">
            <option
                v-for="a in generatorStore.abandoned"
                :key="a"
                :value="a"
                :class="generatorStore.isUnknown(a) ? 'unknown' : ''"
            >
                {{ a }}
            </option>
        </select>

        <!-- Risk -->
        <label>Risque :</label>
        <select v-model="selectedRisk">
            <option
                v-for="r in riskList"
                :key="r"
                :value="r"
                :class="
                    generatorStore.isFake(r)
                        ? 'fake'
                        : generatorStore.isUnknown(r)
                        ? 'unknown'
                        : ''
                "
            >
                {{ r }}
            </option>
        </select>
        <div class="addCustomContainer">
            <input
                v-if="generatorStore.isFake(selectedRisk)"
                v-model="customRisk"
                placeholder="Veuillez saisir un risque"
            />
            <button
                v-if="generatorStore.isFake(selectedRisk)"
                class="material-symbols-outlined btn btn-normal add-btn"
                @click="addCustomRisk"
                :disabled="!customRisk"
                type="button"
            >
                add
            </button>
        </div>

        <!-- Génération -->
        <button class="btn btn-normal" @click="generateNote">Générer</button>

        <!-- Résultat -->
        <div id="resultContainer" v-if="result !== ''">
            <button
                id="copyPaste"
                class="material-symbols-outlined btn btn-normal"
                @click="copyPaste()"
            >
                content_copy
            </button>
            <div id="resultBox">
                <div id="resultDisplay">
                    {{ result }}
                </div>
                <div id="tip">
                    <span class="material-symbols-outlined">info</span>
                    Le texte se copie automatiquement
                </div>
            </div>
        </div>

        <!-- buffer text area -->
        <textarea id="result" v-model="result" readonly></textarea>
    </div>
</template>

<style scoped>
#generator > * {
    width: 100%;
}

.addCustomContainer {
    display: flex;
    flex-direction: row;
    gap: var(--gap);
    align-items: center;
}

input {
    width: 100%;
    align-self: self-start;
}

/* result */

#resultContainer {
    display: flex;
    flex-direction: row;
    gap: var(--gap);
    width: 100%;
}

#resultDisplay {
    min-height: 100px;
    line-height: 1.5;
    box-sizing: border-box;
    background-color: white;
    white-space: pre-line;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;

    width: 100%;
}

#resultBox {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    width: 100%;
}

#tip {
    display: flex;
    flex-direction: row;
    gap: var(--gap);
    align-items: center;
    font-style: italic;
}

#tip * {
    width: auto;
}

#result {
    display: none;
}

#copyPaste {
    width: min-content;
}

.add-btn {
    margin-left: 0.5rem;
    vertical-align: middle;
    font-size: 1.5em;
    padding: 0.2em 0.5em;
}
</style>

<script setup>
import { ref, computed, watch } from "vue";
import { generatorStore } from "../assets/js/stores/generatorStore.js";

const statusList = computed(() => generatorStore.status);
const typeList = computed(() => generatorStore.type);
const riskList = computed(() => generatorStore.risk);

const selectedStatus = ref(statusList.value[0] || "");
const selectedType = ref(typeList.value[0] || "");
const selectedAbandon = ref(generatorStore.abandoned[0] || "");
const selectedRisk = ref(riskList.value[0] || "");

const customStatus = ref("");
const customType = ref("");
const customRisk = ref("");

const result = ref("");

function copyPaste() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(result.value).catch((err) => {
            console.error("Échec de la copie", err);
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

function generateNote() {
    if (generatorStore.isFake(selectedStatus.value) && customStatus.value) {
        let newSelection = generatorStore.addStatus(customStatus.value);
        selectedStatus.value = newSelection;
        customStatus.value = "";
    }
    if (generatorStore.isFake(selectedType.value) && customType.value) {
        let newSelection = generatorStore.addType(customType.value);
        selectedType.value = newSelection;
        customType.value = "";
    }
    if (generatorStore.isFake(selectedRisk.value) && customRisk.value) {
        let newSelection = generatorStore.addRisk(customRisk.value);
        selectedRisk.value = newSelection;
        customRisk.value = "";
    }

    result.value = `${selectedStatus.value}
- ${selectedType.value}
- ${selectedAbandon.value}
- ${selectedRisk.value}`;

    copyPaste();
}

function addCustomStatus() {
    if (customStatus.value) {
        let newSelection = generatorStore.addStatus(customStatus.value);
        selectedStatus.value = newSelection;
        customStatus.value = "";
    }
}
function addCustomType() {
    if (customType.value) {
        let newSelection = generatorStore.addType(customType.value);
        selectedType.value = newSelection;
        customType.value = "";
    }
}
function addCustomRisk() {
    if (customRisk.value) {
        let newSelection = generatorStore.addRisk(customRisk.value);
        selectedRisk.value = newSelection;
        customRisk.value = "";
    }
}

// Watch for list changes and reset selection if needed
watch(statusList, (newList) => {
    if (!newList.includes(selectedStatus.value)) {
        selectedStatus.value = newList[0] || "";
    }
});
watch(typeList, (newList) => {
    if (!newList.includes(selectedType.value)) {
        selectedType.value = newList[0] || "";
    }
});
watch(riskList, (newList) => {
    if (!newList.includes(selectedRisk.value)) {
        selectedRisk.value = newList[0] || "";
    }
});
</script>
