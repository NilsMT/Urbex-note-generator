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
                customRisks: parsed.risk || [],
                customTypes: parsed.types || [],
            };
        } catch {
            // fallback to defaults
        }
    }
    return {
        customStatus: [],
        customRisks: [],
        customTypes: [],
    };
}

function saveToLocalStorage(customStatus, customRisks, customTypes) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
            status: customStatus,
            risk: customRisks,
            types: customTypes,
        })
    );
}

function loadFromLocalStorageOrUrl() {
    // Check for URL params
    const urlParams = new URLSearchParams(window.location.search);
    const hasUrlData =
        urlParams.has("status") ||
        urlParams.has("risk") ||
        urlParams.has("type");
    if (hasUrlData) {
        const shouldLoad = window.confirm(
            "Des données personnalisées ont été trouvées dans l'URL. Voulez-vous les charger à la place de vos données locales ? (Attention: cela écrasera vos éléments personnalisés locaux)"
        );
        if (shouldLoad) {
            // Remove params from URL after loading
            const url = new URL(window.location.href);
            url.searchParams.delete("status");
            url.searchParams.delete("risk");
            url.searchParams.delete("type");
            window.history.replaceState(
                {},
                document.title,
                url.pathname + url.search
            );
            return {
                customStatus: urlParams.getAll("status"),
                customRisks: urlParams.getAll("risk"),
                customTypes: urlParams.getAll("type"),
            };
        }
    }
    // Fallback to localStorage
    return loadFromLocalStorage();
}

const initial = loadFromLocalStorageOrUrl();

export const generatorStore = reactive({
    // Custom values (only these are saved)
    customStatus: [...initial.customStatus],
    customRisks: [...initial.customRisks],
    customTypes: [...initial.customTypes],

    // Computed full lists
    get status() {
        return buildList(DEFAULT_STATUS, this.customStatus, FAKE_STATUS);
    },
    get risk() {
        return buildList(
            DEFAULT_RISK,
            this.customRisks,
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
        this.customRisks = [];
        this.customTypes = [];
        saveToLocalStorage(
            this.customStatus,
            this.customRisks,
            this.customTypes
        );
    },

    // Methods to see if there is any custom data
    hasCustomItems() {
        return (
            this.customStatus.length > 0 ||
            this.customRisks.length > 0 ||
            this.customTypes.length > 0
        );
    },

    // Methods to : export in json, export via URL, import from json, import from URL
    // NOTE: URL will look like this: ?status=...&risk=...&type=...
    exportUrl() {
        const params = new URLSearchParams();
        this.customStatus.forEach((s) => params.append("status", s));
        this.customRisks.forEach((r) => params.append("risk", r));
        this.customTypes.forEach((t) => params.append("type", t));

        const url = `?${params.toString()}`;

        // Try to shorten the URL using TinyURL API
        async function shortenAndCopy(longUrl) {
            try {
                const response = await fetch(
                    `https://tinyurl.com/api-create.php?url=${encodeURIComponent(
                        window.location.origin + longUrl
                    )}`
                );
                if (response.ok) {
                    const shortUrl = await response.text();
                    await copyToClipboard(shortUrl);
                    window.alert(
                        "L'URL courte a été copiée dans le presse-papier :\n" +
                            shortUrl
                    );
                } else {
                    throw new Error("Shorten failed");
                }
            } catch {
                // fallback to long url
                await copyToClipboard(longUrl);
                window.alert(
                    "Impossible de raccourcir l'URL, l'URL complète a été copiée :\n" +
                        longUrl
                );
            }
        }
        function copyToClipboard(text) {
            if (navigator.clipboard && window.isSecureContext) {
                return navigator.clipboard.writeText(text);
            } else {
                // fallback
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                textArea.style.top = 0;
                textArea.style.left = 0;
                textArea.style.width = "2em";
                textArea.style.height = "2em";
                textArea.style.padding = 0;
                textArea.style.border = "none";
                textArea.style.outline = "none";
                textArea.style.boxShadow = "none";
                textArea.style.background = "transparent";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand("copy");
                } catch {}
                document.body.removeChild(textArea);
                return Promise.resolve();
            }
        }
        // Call the async function (fire and forget)
        shortenAndCopy(url);
        return url;
    },

    async importUrl() {
        const url = window.prompt("Veuillez entrer l'URL à importer :");
        if (!url) return;
        try {
            const urlParams = new URLSearchParams(url.split("?")[1]);
            const newStatus = urlParams.getAll("status");
            const newRisks = urlParams.getAll("risk");
            const newTypes = urlParams.getAll("type");
            const shouldImport = window.confirm(
                "Importer ces données écrasera vos éléments personnalisés actuels. Continuer ?"
            );
            if (!shouldImport) return;
            this.customStatus = newStatus;
            this.customRisks = newRisks;
            this.customTypes = newTypes;
            saveToLocalStorage(
                this.customStatus,
                this.customRisks,
                this.customTypes
            );
            // Remove params from URL if importing from current page
            if (url.startsWith(window.location.origin) || url.startsWith("/")) {
                const currentUrl = new URL(window.location.href);
                currentUrl.searchParams.delete("status");
                currentUrl.searchParams.delete("risk");
                currentUrl.searchParams.delete("type");
                window.history.replaceState(
                    {},
                    document.title,
                    currentUrl.pathname + currentUrl.search
                );
            }
            window.alert("URL importée avec succès !");
        } catch (e) {
            window.alert("URL invalide ou erreur lors de l'import.");
        }
    },

    exportJson() {
        const data = {
            status: this.customStatus,
            risk: this.customRisks,
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

    async importJson() {
        try {
            const [fileHandle] = await window.showOpenFilePicker({
                types: [
                    {
                        description: "JSON Files",
                        accept: { "application/json": [".json"] },
                    },
                ],
                multiple: false,
            });
            const file = await fileHandle.getFile();
            const text = await file.text();
            const parsedData = JSON.parse(text);
            const shouldImport = window.confirm(
                "Importer ce fichier écrasera vos éléments personnalisés actuels. Continuer ?"
            );
            if (!shouldImport) return;
            this.customStatus = parsedData.status || [];
            this.customRisks = parsedData.risk || [];
            this.customTypes = parsedData.types || [];
            saveToLocalStorage(
                this.customStatus,
                this.customRisks,
                this.customTypes
            );

            window.alert("Fichier JSON importé avec succès !");
        } catch (error) {
            console.error("Erreur lors de l'import du fichier JSON:", error);
            throw new Error(
                "Erreur lors de l'ouverture ou du parsing du fichier JSON"
            );
        }
    },

    // Methods to add/remove custom items

    /* STATUS */
    addStatus(status) {
        let statusString = `Pas explorable : ${status}`;

        if (!this.customStatus.includes(status)) {
            this.customStatus.push(statusString);
            saveToLocalStorage(
                this.customStatus,
                this.customRisks,
                this.customTypes
            );
        }
        return statusString;
    },
    removeStatus(status) {
        this.customStatus = this.customStatus.filter((s) => s !== status);
        saveToLocalStorage(
            this.customStatus,
            this.customRisks,
            this.customTypes
        );
    },

    /* RISK */
    addRisk(risk) {
        let riskString = `Risqué : ${risk}`;

        if (!this.customRisks.includes(riskString)) {
            this.customRisks.push(riskString);
            saveToLocalStorage(
                this.customStatus,
                this.customRisks,
                this.customTypes
            );
        }

        return riskString;
    },
    removeRisk(risk) {
        this.customRisks = this.customRisks.filter((r) => r !== risk);
        saveToLocalStorage(
            this.customStatus,
            this.customRisks,
            this.customTypes
        );
    },

    /* TYPE */
    addType(type) {
        if (!this.customTypes.includes(type)) {
            this.customTypes.push(type);
            saveToLocalStorage(
                this.customStatus,
                this.customRisks,
                this.customTypes
            );
        }

        return type;
    },
    removeType(type) {
        this.customTypes = this.customTypes.filter((t) => t !== type);
        saveToLocalStorage(
            this.customStatus,
            this.customRisks,
            this.customTypes
        );
    },

    // Export/import only custom arrays
    export() {
        const data = {
            status: this.customStatus,
            risk: this.customRisks,
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
        this.customRisks = parsedData.risk || [];
        this.customTypes = parsedData.types || [];
        saveToLocalStorage(
            this.customStatus,
            this.customRisks,
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
        generatorStore.customRisks,
        generatorStore.customTypes,
    ],
    ([customStatus, customRisks, customTypes]) => {
        saveToLocalStorage(customStatus, customRisks, customTypes);
    },
    { deep: true }
);
