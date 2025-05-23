<template>
    <div id="settings">
        <h2>Paramètres</h2>
        <p>Cette page est en construction.</p>
        <p>
            Vous pouvez supprimer les données personnalisées et
            importer/exporter des données.
        </p>
        <p>
            Nous allons bientôt ajouter la possibilité de sauvegarder vos
            données sur Firebase.
        </p>
        <!-- TODO: make the settings (deletion of custom stuff AND import/export ==> implement firebase) -->
    </div>
</template>

<style scoped>
#settings > *:not(input, #theme) {
    width: 100%;
}
</style>

<script>
export default {
    name: "SettingsComp",
};
</script>
