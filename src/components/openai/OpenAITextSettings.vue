<template>
    <div class="query-settings">
        <h3>Text-query-settings</h3>
        <div class="settingsWrapper">
            <InputNumber
                name="max_tokens"
                min="50"
                max="1000"
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
