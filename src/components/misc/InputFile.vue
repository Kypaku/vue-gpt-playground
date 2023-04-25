<template>
    <div>
        <input type="file" @change="(event) => $emit('update:value', event)" />
        {{ isTranscribing ? "Transcribing..." : "" }}
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        tab: String,
        isTranscribing: Boolean,
    },
    components: {},
    data() {
        return {};
    },
    computed: {},
    methods: {},
});
</script>

<style lang="scss" scoped></style>
