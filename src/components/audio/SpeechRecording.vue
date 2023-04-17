<template>
    <div class="speech-recording">
        <button class="record" @click="record()">Record</button>
        <button class="stop" @click="stop()">Stop</button>
        <div id="output"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        setResult: Function,
        run: Function,
    },
    components: {},
    data() {
        return {
            constraints: { audio: false },
            mediaRecorder: null as any, // new (window as any).MediaRecorder(null),
            chunks: [] as any,
            recordedResult: "",
        };
    },
    computed: {},
    methods: {
        record() {
            this.mediaRecorder.start();
            this.mediaRecorder.onstop = this.onStop;
            this.mediaRecorder.ondataavailable = this.ondataAvailable;
        },
        stop() {
            console.log(this.mediaRecorder);
            this.mediaRecorder.stop();
        },
        onStop() {
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
            fetch(
                "https://api.openai.com/v1/audio/transcriptions",
                requestOptions
            )
                .then((response) => response.json())
                .then((data) => {
                    console.log(data);
                    if (this.setResult) this.setResult(data.text);
                })
                .then(() => {
                    if (this.run) this.run();
                })
                .catch((error) => console.log("Error:", error));
        },
        ondataAvailable(e: any) {
            this.chunks.push(e.data);
        },
    },
    mounted() {
        if (navigator.mediaDevices.getUserMedia) {
            this.constraints = { audio: true };
            const onSuccess = (stream: any) => {
                console.log("STREAM", stream);
                this.mediaRecorder = new (window as any).MediaRecorder(stream);
                console.log(this.mediaRecorder);
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
