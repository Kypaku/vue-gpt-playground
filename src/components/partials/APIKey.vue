<template>
    <Accordeon title="Set API KEY" v-model:value="apiKeyVisible" class="mt-8 api-key" >
        <div>
            <span class="text-sm" >
                To get an API KEY you need to register new OPEN API account
                and then visit
            </span>
            <a
                href="https://platform.openai.com/account/api-keys"
                target="_blank"
            >
                https://platform.openai.com/account/api-keys
            </a>
        </div>
        <InputAPIKey
            :value="value"
            class="w-3/4 mt-4"
            :useLocalStorage="true"
            @update:value="(val: string) => $emit('update:value', val)"
            placeholder="Paste a key here"
        />
    </Accordeon>
</template>

<script lang='ts'>
    import { defineComponent, PropType } from "vue";
    import Accordeon from "@/components/misc/Accordeon.vue"
    ;
    import InputAPIKey from "../openai/InputAPIKey.vue";

    export default defineComponent({
        props: {
            value: String,

        },
        components: {
            Accordeon,
            InputAPIKey
        },
        // emits: ['update:modelValue'], this.$emit('update:modelValue', title)
        data() {
            return {
                apiKeyVisible: false,

            };
        },
        computed: {

        },
        methods: {

        },

        created () {
            if (!this.value) {
                this.apiKeyVisible = true;
            }
        },
    });

    </script>

<style lang="scss" scoped>

</style>
