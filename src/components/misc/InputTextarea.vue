<template>
    <div class="input-text">
        <div>
            <label :for="id" class="mr-2">{{ label }}</label>
        </div>
        <SpeechRecording
            v-if="showSpeechRecording && !apiKeyNeeded"
            @update:value="(val) => $emit('update:value', val)"
        ></SpeechRecording>
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
import SpeechRecording from "../audio/SpeechRecording.vue";

export default defineComponent({
    props: {
        placeholder: String,
        label: String,
        value: String,
        disabled: Boolean,
        isLoading: Boolean,
        showSpeechRecording: Boolean,
        apiKeyNeeded: Boolean,
    },
    components: {
        SpeechRecording,
    },
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
