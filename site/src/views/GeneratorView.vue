<template>
    <div id="generator_cont">
        <GeneratorComp class="section" />

        <SettingsComp class="section" />

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

<script>
import FooterComp from "@/components/FooterComp.vue";
import GeneratorComp from "@/components/GeneratorComp.vue";
import SettingsComp from "@/components/SettingsComp.vue";

export default {
    components: {
        FooterComp,
        GeneratorComp,
        SettingsComp,
    },
};
</script>
