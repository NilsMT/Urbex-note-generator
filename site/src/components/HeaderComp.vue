<template>
    <header>
        <!-- Thème -->
        <div
            class="material-symbols-outlined btn btn-normal"
            id="theme"
            @click="themeStore.toggleTheme"
        >
            {{ themeStore.currentIcon }}
        </div>
    </header>
</template>

<style scoped>
header {
    padding: var(--padding);

    background-color: var(--bg);
    box-shadow: 0px 0px 20px #0005;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: var(--gap);
}

#theme {
    padding: var(--small-padding);
    cursor: pointer;
}
</style>

<script setup>
import { themeStore } from "@/assets/js/stores/themeStore";
</script>
