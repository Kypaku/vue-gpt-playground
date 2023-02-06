<template>
    <div class="app">
        <div class="text-2xl w-full text-center mt-10"><b>Vue.js GPT API Sample:</b></div>
        <div class="main container mx-auto mt-10">
            <div class="mt-4">
                Below you can input code and test completion. Model: code-davinci-002
            </div>
            <InputText v-model:value="apiKey" :label="'API Key:'" class="w-1/2 mt-4" @update:value="(val) => api.setApiKey(val)"/>
            <InputTextarea v-model:value="promt" :label="'Promt:'"  class="w-1/2 mt-8" :rows="10"/>
            <button @click="run" class="mt-2 bg-gray-300 px-2 py-1">{{isLoading ? 'Loading...' : 'Run'}}</button>
            <InputTextarea v-model:value="result" :label="'Result:'" disabled class="mt-8 w-1/2" :rows="10"/>
        </div>
    </div>
</template>

<script lang='ts'>
    import api from "./api/openai";
    import { defineComponent } from "@vue/runtime-core";
    import InputText from "./components/misc/InputText.vue";
    import InputTextarea from "./components/misc/InputTextarea.vue";

    export default defineComponent({
        components: {
            InputTextarea,
            InputText,

        },
        data() {
            return {
                result: "",
                isLoading: false,
                promt: "",
                apiKey: "",
                api,
            };
        },
        computed: {

        },
        methods: {
            async run() {
                if (!this.isLoading) {
                    this.isLoading = true;
                    try {
                        const res = await api.getFirst(this.promt);
                        this.result = res || "";
                    } catch (e) {
                        console.error("App error: " + e);
                    } finally {
                        this.isLoading = false;
                    }
                }
            },

        },
    });

    </script>

<style lang="scss" scoped>

</style>
