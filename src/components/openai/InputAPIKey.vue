<template>
    <div class="input-api-key">
        <div class="tip bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded relative mt-2" v-if="!value && showWarn">
            To get an API KEY you need to register new OPEN AI account (if you haven't) and then visit
            <a href="https://platform.openai.com/account/api-keys" class="font-bold underline ml-1 sm:ml-0" target="_blank">
                the page
            </a>
        </div>
        <div class="tip bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-3 rounded relative mt-2" v-if="useLocalStorage && showWarn">
            The key will saved only in your browser
        </div>
        <InputText
            :value="value"
            type="password"
            :label="'API Key:'"
            class="w-1/2 mt-2"
            @update:value="(val) => ($emit('update:value', val), useLocalStorage && ls(localStorageKey, val))"
            placeholder="Paste a key here"
        />
    </div>
</template>

<script lang='ts'>
    import { defineComponent, PropType } from "vue"
    ;
    import InputText from "../misc/InputText.vue";
    import ls from "local-storage";

    export default defineComponent({
        props: {
            localStorageKey: {
                type: String,
                default: () => 'openAIKey'
            },
            useLocalStorage: {
                type: Boolean,
                default: () => false
            },
            showWarn: {
                type: Boolean,
                default: () => false
            },
            value: {
                type: String,
                default: () => ""
            },

        },
        components: {
            InputText
        },
        // emits: ['update:modelValue'], this.$emit('update:modelValue', title)
        data() {
            return {
                ls,

            };
        },
        computed: {

        },
        methods: {

        },
    });

    </script>

<style lang="scss" scoped>

</style>
