<template>
    <div id="cont">
        <div id="code">
            <span>4</span>
            <img src="../assets/img/Erreur404/think.png" />
            <span>4</span>
        </div>

        <div id="text">La page que vous recherchez n'existe pas</div>
        <router-link class="btn btn-normal" to="/">
            Retour à l'accueil
            <span class="material-symbols-outlined"> home </span>
        </router-link>

        <div
            class="material-symbols-outlined btn btn-normal"
            @click="themeStore.toggleTheme"
        >
            {{ themeStore.isDarkMode ? "dark_mode" : "light_mode" }}
        </div>
    </div>

    <FooterComp />
</template>

<style scoped>
#cont {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    gap: var(--gap);
    color: var(--text);
}

#code {
    font-size: 10rem;
    margin: 0px;
    padding: var(--padding);

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}

#code > img {
    width: 9rem;
    aspect-ratio: 1 / 1;
}

:root.light #code > img {
    filter: invert(1);
}
</style>

<script>
import FooterComp from "../components/FooterComp.vue";
import { themeStore } from "../assets/js/stores/themeStore.js";

export default {
    components: {
        FooterComp,
    },
    setup() {
        return {
            themeStore,
        };
    },
};
</script>
