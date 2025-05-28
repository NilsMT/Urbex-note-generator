<template>
    <header>
        <!-- Thème -->
        <ThemeButtonComp id="theme"></ThemeButtonComp>

        <a class="btn btn-normal btn-icon-text" 
            href="https://chromewebstore.google.com/detail/urbex-note-generator/fponhmoolhcfodfgogjgldhjpioemjkp"
            target="_blank"
        >
            <span class="material-symbols-outlined">open_in_new</span> 
            Télécharger l'extension 
        </a>
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
    justify-content: space-around;
    gap: var(--gap);
}

#theme {
    padding: var(--small-padding);
    cursor: pointer;
}
</style>

<script setup>
import ThemeButtonComp from "./ThemeButtonComp.vue";
</script>
