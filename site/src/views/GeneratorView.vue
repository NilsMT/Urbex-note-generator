<template>
    <div id="generator_cont">
        <HeaderComp />

        <GeneratorComp class="section" />

        <SettingsComp v-if="showSettings" class="section" />

        <FooterComp />
    </div>
</template>

<style scoped>
#generator_cont {
    gap: 2rem;
    display: flex;
    flex-direction: column;
}
</style>

<script setup>
import { ref, watch } from "vue";
import HeaderComp from "@/components/HeaderComp.vue";
import FooterComp from "@/components/FooterComp.vue";
import GeneratorComp from "@/components/GeneratorComp.vue";
import SettingsComp from "@/components/SettingsComp.vue";
import { generatorStore } from "@/assets/js/stores/generatorStore";

const showSettings = ref(generatorStore.hasCustomItems());

watch(
    () => generatorStore.hasCustomItems(),
    (newVal) => {
        showSettings.value = newVal;
    }
);
</script>
