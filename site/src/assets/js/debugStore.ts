import { reactive, ref } from 'vue'
import { DebugConstant } from './debugConstant'

const DEFAULT_DEBUG_MODE: boolean = DebugConstant.DEBUG_ENABLED
const DEBUG_CLASS: string = 'debug'
const DEBUG_KEY = 'debugEnabled'
const root = document.documentElement

// Reactive store
export const debugStore = reactive({
    currentMode: ref(localStorage.getItem(DEBUG_KEY)),

    init() {
        const debugMode = localStorage.getItem(DEBUG_KEY) || DEFAULT_DEBUG_MODE
        this.currentMode = debugMode
        
        if (debugMode == DebugConstant.DEBUG_ENABLED) {
            root.classList.add(DEBUG_CLASS)
        } else {
            root.classList.remove(DEBUG_CLASS)
        }
    },

    toggleDebug() {
        let isDebugMode = (this.currentMode == DebugConstant.DEBUG_ENABLED)

        if (isDebugMode) {
            localStorage.setItem(DEBUG_KEY, DebugConstant.DEBUG_ENABLED.toString())
        } else {
            localStorage.setItem(DEBUG_KEY, DebugConstant.DEBUG_DISABLED.toString())
            root.classList.remove(DEBUG_CLASS)
        }
    }
})