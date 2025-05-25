<template>
    <footer>
        <div id="debug" @click="debugStore.toggleDebug">
            © {{ currentYear }} NilsMT, Tous droits réservés
        </div>
    </footer>
</template>

<style scoped>
footer {
    z-index: 1;
    padding: var(--padding);

    background-color: var(--bg);
    box-shadow: 0px 0px 20px #0005;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    gap: var(--gap);
}

#debug {
    cursor: help;

    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
</style>

<script setup>
import { ref } from "vue";
import { debugStore } from "../assets/js/stores/debugStore.js";

const currentYear = ref(new Date().getFullYear());
</script>
