<template>
    <div class="input-text">
        <div>
            <label :for="id" class="mr-2">{{ label }}</label>
        </div>
        <textarea
            type="text"
            class="border-2"
            ref="input"
            :id="id"
            :value="value"
            v-bind="{ ...$attrs, class: 'w-full' }"
            :placeholder="placeholder"
            :disabled="disabled"
            @keypress.enter="$emit('end')"
            @input="(ev) => $emit('update:value', ev.target?.value)"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export interface InputTextSuggestion {
    name: string;
    value: string;
}

export default defineComponent({
    props: {
        placeholder: String,
        label: String,
        value: String,
        disabled: Boolean,
    },
    components: {},
    data() {
        return {
            id: "input-text" + +new Date(),
        };
    },
    computed: {},
    methods: {},

    mounted() {
        this.$emit("mounted", this.$refs.input);
    },
});
</script>

<style lang="scss" scoped>
.first {
    font-weight: 700;
}
</style>
