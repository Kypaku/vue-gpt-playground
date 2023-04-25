<template>
    <div>
        <input type="file" @change="(event) => transcribe(event)" />
        {{ isTranscribing ? "Transcribing..." : "" }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        tab: String,
    },
    components: {},
    data() {
        return {
            isTranscribing: false,
        };
    },
    computed: {},
    methods: {
        transcribe(event: any) {
            this.$emit("update:value", event);
            this.toggleLoader();
            setTimeout(this.toggleLoader, 3000);
        },
        toggleLoader() {
            this.isTranscribing = !this.isTranscribing;
        },
    },
});
</script>

<style lang="scss" scoped></style>
