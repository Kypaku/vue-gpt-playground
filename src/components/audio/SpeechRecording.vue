<template>
    <div class="speech-recording">
        <button class="record" @click="record()">Record</button>
        <button class="stop" @click="stop()">Stop</button>
        <div v-if="isLoading">Loading...</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SimpleGPT from "./../../api/openai";

export default defineComponent({
    // props: {
    // },
    components: {},
    data() {
        return {
            constraints: { audio: false },
            mediaRecorder: null as any, // new (window as any).MediaRecorder(null),
            chunks: [] as any,
            recordedResult: "",
            apiKey: process.env.OPENAI_API_KEY || "",
            api: new SimpleGPT({ key: process.env.OPENAI_API_KEY || "" }),
            isLoading: false,
        };
    },
    computed: {},
    methods: {
        record() {
            if (!this.mediaRecorder) {
                alert("You have a problem with your device");
            }
            this.mediaRecorder.start();
            this.mediaRecorder.onstop = this.onStop;
            this.mediaRecorder.ondataavailable = this.ondataAvailable;
        },
        stop() {
            // console.log(this.mediaRecorder);
            this.mediaRecorder.stop();
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
            this.$emit("setPrompt", text);
            this.isLoading = false;
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
    margin: 10px 0;
    button {
        padding: 5px;
        margin-right: 10px;
        border-radius: 5px;
        border: 1px solid #b2aeae;
    }
}
</style>
