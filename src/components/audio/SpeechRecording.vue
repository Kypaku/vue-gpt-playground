<template>
    <div class="speech-recording">
        <button class="record">Record</button>
        <button class="stop">Stop</button>
        <div id="output"></div>
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
    methods: {},
    mounted() {
        const stream = navigator.mediaDevices.getUserMedia();
        console.log(stream);
    },
});
</script>

<style lang="scss" scoped></style>
