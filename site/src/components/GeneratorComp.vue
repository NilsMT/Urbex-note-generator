<template>
    <div id="generator">
        <!-- Thème -->
        <div id="themeContainer">
            <div>
                Vous pouvez changer le thème ici
                <span class="material-symbols-outlined"
                    >keyboard_double_arrow_right</span
                >
            </div>
            <div
                class="material-symbols-outlined btn btn-normal"
                id="theme"
                @click="themeStore.toggleTheme"
            >
                {{ themeStore.currentIcon }}
            </div>
        </div>

        <h2>Générateur de note d'urbex</h2>

        <!-- Status -->
        <label>Status :</label>
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
        <input
            v-if="generatorStore.isFake(selectedStatus)"
            v-model="customStatus"
            placeholder="Veuillez saisir une raison"
        />

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
        <input
            v-if="generatorStore.isFake(selectedType)"
            v-model="customType"
            placeholder="Veuillez saisir un type"
        />

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
        <input
            v-if="generatorStore.isFake(selectedRisk)"
            v-model="customRisk"
            placeholder="Veuillez saisir un risque"
        />

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
#generator > *:not(input, #theme) {
    width: 100%;
}

#themeContainer {
    display: flex;
    flex-direction: row;
    gap: var(--gap);
    align-items: center;
}

#theme {
    width: min-content;
    align-self: self-start;
}

input {
    width: 80%;
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

/* options */

*.fake {
    font-style: italic;
    background-color: #c9c9c9;
}

*.unknown {
    font-weight: bold;
    background-color: #fff185;
}
</style>

<script setup>
import { ref, computed } from "vue";
import { generatorStore } from "../assets/js/stores/generatorStore.js";
import { themeStore } from "../assets/js/stores/themeStore.js";

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

    this.copyPaste();
}

function copyPaste() {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(this.result.value).catch((err) => {
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
</script>
