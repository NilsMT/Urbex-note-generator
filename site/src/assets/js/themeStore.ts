import { reactive, ref } from 'vue'
import { ThemeConstant } from './themeConstant'

const defaultTheme: string = ThemeConstant.LIGHT
const THEME_KEY: string = 'currentTheme'
const root: HTMLElement = document.documentElement

// Reactive store
export const themeStore = reactive({
    currentTheme: ref(localStorage.getItem(THEME_KEY)),

    init() {
        const theme = localStorage.getItem(THEME_KEY) || defaultTheme
        this.currentTheme = theme
        root.classList.remove(ThemeConstant.LIGHT, ThemeConstant.DARK)
        root.classList.add(theme)
    },

    toggleTheme() {
        let isDarkMode = (this.currentTheme == ThemeConstant.DARK)

        if (isDarkMode) {
            localStorage.setItem(THEME_KEY, ThemeConstant.LIGHT)
            this.currentTheme = ThemeConstant.LIGHT
            root.classList.add(ThemeConstant.LIGHT)
            root.classList.remove(ThemeConstant.DARK)
        } else {
            localStorage.setItem(THEME_KEY, ThemeConstant.DARK)
            this.currentTheme = ThemeConstant.DARK
            root.classList.add(ThemeConstant.DARK)
            root.classList.remove(ThemeConstant.LIGHT)
        }
    }
})

// Call themeStore.init() in your main entry file (e.g., main.ts or App.vue mounted)