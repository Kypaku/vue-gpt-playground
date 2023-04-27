<template>
    <div>
        <input type="file" @change="(event) => transcribe(event)" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    // props: {},
    components: {},
    data() {
        return {};
    },
    computed: {},
    methods: {
        transcribe(event: any) {
            this.$emit("update:value", event);
        },
    },
});
</script>

<style lang="scss" scoped></style>
