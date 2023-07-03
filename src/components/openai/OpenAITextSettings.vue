<template>
    <div class="query-settings">
        <div class="flex-center-between">
            <b>GPT settings</b>
            <button class="underline text-sm"  @click="editJson = !editJson"> {{ editJson ? 'Hide' : 'Edit' }} json </button>
        </div>
        <div class="settingsWrapper flex-col" v-if="!editJson">
            <InputText
                class="mt-1"
                name="model"
                :value="value?.model"
                label="Model"
                :placeholder="'gpt-3.5-turbo-0613'"
                :suggestions="modelsSuggestions"
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
            <ToggleSwitch class="mt-2"  :value="value?.stream ?? true" label="Stream" @update:value="(newVal) =>
                $emit('update:value', {
                    ...value,
                    ['stream']: newVal,
                })" />
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
        <div v-else>
            <textarea v-model="json" @input="ev => $emit('update:value', JSON.parse(ev?.target?.value))" rows="15" class="w-full"></textarea>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import { CreateCompletionRequest } from "openai";
    import InputNumber from "../misc/InputNumber.vue";
    import InputText, { InputTextSuggestion } from "@/components/misc/InputText.vue";
    import { uniq } from "lodash";
    import ToggleSwitch from "../misc/ToggleSwitch.vue";

    export default defineComponent({
        props: {
            models: {
                type: Array as PropType<string[]>,
                default: () => []
            },
            value: Object as PropType<Partial<CreateCompletionRequest>>,
        },
        components: {
            InputText,
            InputNumber,
            ToggleSwitch
        },
        data() {
            return {
                json: "",
                editJson: false,
            };
        },
        computed: {
            modelsSuggestions(): InputTextSuggestion[] {
                return [...uniq(this.models).map((el) => ({ name: el, value: el }))].reverse();
            },
        },
        methods: {
            show() {
                console.log(this.value?.max_tokens);
            },
        },
        // mounted() {},

        watch: {
            value: {
                handler(newVal) {
                    this.json = JSON.stringify(newVal, null, 2);
                },
                deep: true,
                immediate: true,
            },
        },
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

.flex-center-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
