import { reactive, ref } from "vue";
import { DebugConstant } from "../constants/debugConstant";

const DEFAULT_DEBUG_MODE = DebugConstant.DEBUG_DISABLED;
const DEBUG_CLASS = "debug";
const DEBUG_KEY = "debugEnabled";
const root = document.documentElement;

// Reactive store
export const debugStore = reactive({
    currentMode: ref(
        localStorage.getItem(DEBUG_KEY) === DebugConstant.DEBUG_ENABLED
    ),

    updateDebug() {
        if (this.currentMode) {
            root.classList.add(DEBUG_CLASS);
            localStorage.setItem(DEBUG_KEY, DebugConstant.DEBUG_ENABLED);
        } else {
            root.classList.remove(DEBUG_CLASS);
            localStorage.setItem(DEBUG_KEY, DebugConstant.DEBUG_DISABLED);
        }
    },

    toggleDebug() {
        this.currentMode = !this.currentMode;
        this.updateDebug();
    },
});

// Initialize debug mode if not stored yet
if (localStorage.getItem(DEBUG_KEY) == null) {
    localStorage.setItem(DEBUG_KEY, DEFAULT_DEBUG_MODE);
}
// Set starting debug mode
debugStore.currentMode = localStorage.getItem(DEBUG_KEY) === "true";
debugStore.updateDebug();
