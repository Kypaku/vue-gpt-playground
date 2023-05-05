<template>
    <div class="speech-recording">
        <button :disabled="recordDisabled" @click="record()">&#127908;</button>
        <button :disabled="stopDisabled" @click="stop()">
            <span class="stop"></span>
        </button>
        <div v-if="isLoading">Transcribing...</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SimpleGPT from "./../../api/openai";

export default defineComponent({
    components: {},
    props: {
        value: String,
    },
    data() {
        return {
            constraints: { audio: false },
            mediaRecorder: null as any,
            chunks: [] as any,
            recordedResult: "",
            api: new SimpleGPT({ key: process.env.OPENAI_API_KEY || "" }),
            isLoading: false,
            recordDisabled: false,
            stopDisabled: true,
        };
    },
    computed: {},
    methods: {
        record() {
            if (!this.mediaRecorder) {
                alert("You have a problem with your device");
            }
            this.mediaRecorder.start();
            this.recordDisabled = true;
            this.stopDisabled = false;
            this.mediaRecorder.onstop = this.onStop;
            this.mediaRecorder.ondataavailable = this.ondataAvailable;
        },
        stop() {
            this.mediaRecorder.stop();
            this.stopDisabled = true;
            this.isLoading = true;
        },
        async onStop() {
            const blob = new Blob(this.chunks, { type: "audio/webm" });
            this.chunks = [];
            let token = localStorage.getItem("key");
            if (!token || token.length < 10) {
                token = prompt(
                    "Please input OpenAI API key (stored in browser cache)",
                    ""
                );
                localStorage.setItem("key", token || "");
            }
            const formData = new FormData();
            formData.append("file", blob, "test.webm");
            formData.append("model", "whisper-1");
            const requestOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            };
            const text = await this.api.transcribe(requestOptions);
            this.$emit("update:value", text);
            this.isLoading = false;
            this.recordDisabled = false;
            console.log(text);
        },
        ondataAvailable(e: any) {
            this.chunks.push(e.data);
        },
    },
    mounted() {
        if (navigator.mediaDevices.getUserMedia) {
            this.constraints = { audio: true };
            const onSuccess = (stream: any) => {
                this.mediaRecorder = new (window as any).MediaRecorder(stream);
            };
            const onError = (err: any) => {
                console.log("The following error occured: " + err);
            };
            navigator.mediaDevices
                .getUserMedia(this.constraints)
                .then(onSuccess, onError);
        }
    },
});
</script>

<style lang="scss" scoped>
.speech-recording {
    display: flex;
    align-items: center;
    margin: 10px 0;
    button {
        width: 36px;
        height: 36px;
        margin-right: 10px;
        border-radius: 5px;
        border: 1px solid #b2aeae;
        &:disabled {
            cursor: not-allowed;
            background-color: #f6f6f6;
        }
    }
    .stop {
        display: block;
        margin: auto;
        width: 16px;
        height: 16px;
        border-radius: 2px;
        background: #ee8181;
    }
}
</style>
