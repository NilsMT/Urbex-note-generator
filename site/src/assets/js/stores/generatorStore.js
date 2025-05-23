import {
    DEFAULT_RISK,
    DEFAULT_STATUS,
    DEFAULT_TYPES,
    DEFAULT_ABANDONED,
    FAKE_STATUS,
    FAKE_RISK,
    FAKE_TYPE,
    UNKNOWN_RISK,
    UNKNOWN_TYPE,
    UNKNOWN_ABANDONED,
} from "../constants/generatorConstant";
import { reactive, ref, watch } from "vue";

const STORAGE_KEY = "generatorStoreData";

// Helper to reconstruct the full list
function buildList(defaults, customs, fake, unknown = null) {
    let list = [...defaults, ...customs];

    if (unknown) {
        list.push(unknown);
    }

    list.push(fake);

    return list;
}

function loadFromLocalStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        try {
            const parsed = JSON.parse(data);
            return {
                customStatus: parsed.status || [],
                customRisk: parsed.risk || [],
                customTypes: parsed.types || [],
            };
        } catch {
            // fallback to defaults
        }
    }
    return {
        customStatus: [],
        customRisk: [],
        customTypes: [],
    };
}

function saveToLocalStorage(customStatus, customRisk, customTypes) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            status: customStatus,
            risk: customRisk,
            types: customTypes,
        })
    );
}

const initial = loadFromLocalStorage();

export const generatorStore = reactive({
    // Custom values (only these are saved)
    customStatus: ref([...initial.customStatus]),
    customRisk: ref([...initial.customRisk]),
    customTypes: ref([...initial.customTypes]),

    // Computed full lists
    get status() {
        return buildList(DEFAULT_STATUS, this.customStatus, FAKE_STATUS);
    },
    get risk() {
        return buildList(
            DEFAULT_RISK,
            this.customRisk,
            FAKE_RISK,
            UNKNOWN_RISK
        );
    },
    get type() {
        return buildList(
            DEFAULT_TYPES,
            this.customTypes,
            FAKE_TYPE,
            UNKNOWN_TYPE
        );
    },

    get abandoned() {
        return [...DEFAULT_ABANDONED, UNKNOWN_ABANDONED];
    },

    // Methods to reset custom lists
    reset() {
        this.customStatus = [];
        this.customRisk = [];
        this.customTypes = [];
        saveToLocalStorage(
            this.customStatus,
            this.customRisk,
            this.customTypes
        );
    },

    // Methods to add/remove custom items

    /* STATUS */
    addStatus(status) {
        let statusString = `Pas explorable: ${status}`;

        if (!this.customStatus.includes(status)) {
            this.customStatus.push(statusString);
            saveToLocalStorage(
                this.customStatus,
                this.customRisk,
                this.customTypes
            );
        }
        return statusString;
    },
    removeStatus(status) {
        this.customStatus = this.customStatus.filter((s) => s !== status);
        saveToLocalStorage(
            this.customStatus,
            this.customRisk,
            this.customTypes
        );
    },

    /* RISK */
    addRisk(risk) {
        let riskString = `Risqué: ${risk}`;

        if (!this.customRisk.includes(riskString)) {
            this.customRisk.push(riskString);
            saveToLocalStorage(
                this.customStatus,
                this.customRisk,
                this.customTypes
            );
        }

        return riskString;
    },
    removeRisk(risk) {
        this.customRisk = this.customRisk.filter((r) => r !== risk);
        saveToLocalStorage(
            this.customStatus,
            this.customRisk,
            this.customTypes
        );
    },

    /* TYPE */
    addType(type) {
        if (!this.customTypes.includes(type)) {
            this.customTypes.push(type);
            saveToLocalStorage(
                this.customStatus,
                this.customRisk,
                this.customTypes
            );
        }

        return type;
    },
    removeType(type) {
        this.customTypes = this.customTypes.filter((t) => t !== type);
        saveToLocalStorage(
            this.customStatus,
            this.customRisk,
            this.customTypes
        );
    },

    // Export/import only custom arrays
    export() {
        const data = {
            status: this.customStatus,
            risk: this.customRisk,
            types: this.customTypes,
        };
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generatorData.json";
        a.click();
        URL.revokeObjectURL(url);
    },
    import(data) {
        const parsedData = JSON.parse(data);
        this.customStatus = parsedData.status || [];
        this.customRisk = parsedData.risk || [];
        this.customTypes = parsedData.types || [];
        saveToLocalStorage(
            this.customStatus,
            this.customRisk,
            this.customTypes
        );
    },

    // Check if a value is fake
    isFake(value) {
        return (
            FAKE_STATUS === value || FAKE_RISK === value || FAKE_TYPE === value
        );
    },

    // Check if a value is unknown
    isUnknown(value) {
        return (
            value === UNKNOWN_RISK ||
            value === UNKNOWN_TYPE ||
            value === UNKNOWN_ABANDONED
        );
    },
});

// Watch for changes in custom arrays only
watch(
    () => [
        generatorStore.customStatus,
        generatorStore.customRisk,
        generatorStore.customTypes,
    ],
    ([customStatus, customRisk, customTypes]) => {
        saveToLocalStorage(customStatus, customRisk, customTypes);
    },
    { deep: true }
);
