<template>
    <div class="input-text">
        <label :for="id" class="mr-2">{{ label }}</label>
        <input
            type="text"
            class="border-2"
            ref="input"
            :id="id"
            :value="value"
            v-bind="$attrs"
            :placeholder="placeholder"
            @keypress.enter="$emit('end')"
            @input="(ev) => $emit('update:value', ev?.target?.value)"
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
        rows: {
            type: Number,
        },
        placeholder: String,
        label: String,
        value: String,
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
