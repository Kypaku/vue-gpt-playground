<template>
    <div class="input-numder">
        <label class="mr-2">{{ label }}</label>
        <div class="text-left">
            <input
                v-bind="$attrs"
                class="border-2 px-2 py-1 rounded w-full" 
                type="number"
                placeholder="enter value"
                :value="value"
                @input="$emit('update:value', +$event.target?.value)"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        props: {
            value: Number,
            label: String,
        },
        components: {},
        data() {
            return {};
        },
        computed: {},
        methods: {},
    // mounted() {},
    });
</script>

<style lang="scss" scoped></style>
