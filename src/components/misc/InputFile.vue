<template>
    <div>
        <input type="file" @change="(event) => transcribe(event)" :accept="acceptedFileTypes" />
    </div>
</template>

<script lang="ts">
    import { defineComponent } from "vue";

    export default defineComponent({
        props: {
            accept: {
                type: Array,
                default: () => [],
            },
        },
        components: {},
        data() {
            return {};
        },
        computed: {
            acceptedFileTypes() {
                return this.accept.join(",");
            }
        },
        methods: {
            transcribe(event: any) {
                this.$emit("update:value", event);
            },
        },
    });
</script>

<style lang="scss" scoped></style>
