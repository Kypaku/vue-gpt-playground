<template>
    <div class="query-settings">
        <b>GPT settings</b>
        <div class="settingsWrapper flex-col">
            <InputNumber
                class="mt-1"
                name="max_tokens"
                min="50"
                max="4055"
                :value="value?.max_tokens"
                label="max_tokens"
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
                label="temperature"
                @update:value="
                    (newVal) =>
                        $emit('update:value', {
                            ...value,
                            ['temperature']: newVal,
                        })
                "
            />
            <InputNumber
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
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { CreateCompletionRequest } from "openai";
import InputNumber from "../misc/InputNumber.vue";

export default defineComponent({
    props: {
        value: Object as PropType<Partial<CreateCompletionRequest>>,
    },
    components: {
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
        display: flex;
    }
}
</style>
