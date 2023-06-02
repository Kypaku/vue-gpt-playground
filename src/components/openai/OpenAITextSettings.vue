<template>
    <div class="query-settings">
        <b>GPT settings</b>
        <div class="settingsWrapper flex-col">
            <InputText
                class="mt-1"
                name="model"
                :value="value?.model"
                label="Model"
                :placeholder="'gpt-3.5-turbo-0301'"
                @update:value="
                    (newVal) =>
                        $emit('update:value', {
                            ...value,
                            ['model']: newVal,
                        })
                "
            />
            <InputNumber
                class="mt-1"
                name="max_tokens"
                min="50"
                max="4054"
                :value="value?.max_tokens"
                label="Max tokens"
                @update:value="
                    (newVal) =>
                        $emit('update:value', {
                            ...value,
                            ['max_tokens']: newVal,
                        })
                "
            />
            <InputNumber
                class="mt-1"
                name="temperature"
                min="0"
                max="1"
                step="0.1"
                :value="value?.temperature"
                label="Temperature"
                @update:value="
                    (newVal) =>
                        $emit('update:value', {
                            ...value,
                            ['temperature']: newVal,
                        })
                "
            />
            <!-- <InputNumber
                class="mt-1"
                name="n"
                min="0"
                max="5"
                :value="value?.n"
                label="number of"
                @update:value="
                    (newVal) =>
                        $emit('update:value', {
                            ...value,
                            ['n']: newVal,
                        })
                "
            /> -->
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import { CreateCompletionRequest } from "openai";
    import InputNumber from "../misc/InputNumber.vue";
    import InputText from "@/components/misc/InputText.vue";

    export default defineComponent({
        props: {
            value: Object as PropType<Partial<CreateCompletionRequest>>,
        },
        components: {
            InputText,
            InputNumber,
        },
        data() {
            return {};
        },
        computed: {},
        methods: {
            show() {
                console.log(this.value?.max_tokens);
            },
        },
    // mounted() {},
    });
</script>

<style lang="scss" scoped>
.query-settings {
    color: #000;
    .settingsWrapper {
        max-width: 260px;
        display: flex;
    }
}
</style>
