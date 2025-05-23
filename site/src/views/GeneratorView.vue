<template>
    <div id="generator_cont">
        <HeaderComp />

        <GeneratorComp class="section" />

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
import HeaderComp from "@/components/HeaderComp.vue";
import GeneratorComp from "@/components/GeneratorComp.vue";
import { ref } from "vue";

export default {
    components: {
        FooterComp,
        HeaderComp,
        GeneratorComp,
    },
};
</script>
