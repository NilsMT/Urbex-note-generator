<template>
    <div id="settings">
        <h2>Gestion des éléments ajoutées</h2>

        <select id="category_selector" v-model="selectedCategory">
            <option class="fake" value="none">
                Veuillez sélectionner une catégorie
            </option>
            <option
                value="status"
                v-if="generatorStore.customStatus.length > 0"
            >
                Statuts
            </option>
            <option value="types" v-if="generatorStore.customTypes.length > 0">
                Types
            </option>
            <option value="risks" v-if="generatorStore.customRisks.length > 0">
                Risques
            </option>
        </select>

        <div id="category_content" v-if="selectedCategory !== 'none'">
            <div
                class="category_item"
                v-for="item in categoryDictionnary[selectedCategory].items"
            >
                <span>{{ item }}</span>
                <button
                    class="btn btn-danger material-symbols-outlined"
                    @click="onDeleteItem(item)"
                >
                    delete
                </button>
            </div>
        </div>

        <div id="json_options">
            <button
                class="btn btn-normal btn-icon-text"
                @click="generatorStore.exportJson"
            >
                <span class="material-symbols-outlined">download</span>
                Exporter vers un JSON
            </button>

            <button
                class="btn btn-normal btn-icon-text"
                @click="generatorStore.importJson"
            >
                <span class="material-symbols-outlined">upload</span>
                Importer depuis un JSON
            </button>

            <button
                class="btn btn-normal btn-icon-text"
                @click="generatorStore.exportUrl"
            >
                <span class="material-symbols-outlined">link</span>
                Exporter vers un URL
            </button>
            <button
                class="btn btn-normal btn-icon-text"
                @click="generatorStore.importUrl"
            >
                <span class="material-symbols-outlined">add_link</span>
                Importer depuis un URL
            </button>
        </div>
    </div>
</template>

<style scoped>
#settings > * {
    width: 100%;
}

#category_content {
    display: flex;
    flex-direction: column;
    padding: 0px var(--padding);

    border-radius: var(--radius);
    background-color: #fff;

    border: solid 4px var(--bg-dark);

    box-sizing: border-box;
    width: 100%;

    max-height: 300px;
    overflow-y: auto;
}

.category_item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding-top: var(--small-padding);
    padding-bottom: var(--small-padding);

    border-bottom: solid 1px var(--bg-dark);
}

.category_item:last-child {
    border-bottom: none;
}

#json_options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--gap);
    padding: var(--padding);
}

.btn-icon-text {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--gap);

    width: 100%;
}

@media (max-width: 768px) {
    #json_options {
        grid-template-columns: 1fr;
    }
}
</style>

<script setup>
import { ref } from "vue";
import { generatorStore } from "@/assets/js/stores/generatorStore";

const selectedCategory = ref("none");

const categoryDictionnary = {
    status: {
        items: generatorStore.customStatus,
    },
    types: {
        items: generatorStore.customTypes,
    },
    risks: {
        items: generatorStore.customRisks,
    },
};

function updateCategoryDictionnary() {
    categoryDictionnary.status.items = generatorStore.customStatus;
    categoryDictionnary.types.items = generatorStore.customTypes;
    categoryDictionnary.risks.items = generatorStore.customRisks;

    console.log(categoryDictionnary);
}

function onDeleteItem(item) {
    if (selectedCategory.value === "status") {
        generatorStore.removeStatus(item);
    } else if (selectedCategory.value === "types") {
        generatorStore.removeType(item);
    } else if (selectedCategory.value === "risks") {
        generatorStore.removeRisk(item);
    }

    // Update the category dictionary after deletion
    updateCategoryDictionnary();

    // Remove the item from the generator store
    if (categoryDictionnary[selectedCategory.value].items.length === 0) {
        selectedCategory.value = "none";
    }
}
</script>
