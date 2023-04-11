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
    // props: {},
    components: {},
    data() {
        return {
            constraints: { audio: false },
            mediaRecorder: null as any, // new (window as any).MediaRecorder(null),
            chunks: [] as any,
        };
    },
    computed: {},
    methods: {
        record() {
            this.mediaRecorder.start();
            this.mediaRecorder.onstop = this.onStop;
            this.mediaRecorder.ondataAvailable = this.ondataAvailable;
            console.log(this.mediaRecorder);
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
                })
                .catch((error) => console.log("Error:", error));
        },
        ondataAvailable(e: any) {
            this.chunks.push(e.data);
            console.log(this.chunks);
        },
    },
    mounted() {
        if (navigator.mediaDevices.getUserMedia) {
            this.constraints = { audio: true };
            // let chunks = [] as any;
            const onSuccess = (stream: any) => {
                this.mediaRecorder = new (window as any).MediaRecorder(stream);
                console.log(this.mediaRecorder);
                // mediaRecorder.start();
                // setTimeout(() => {
                //    mediaRecorder.stop();
                // }, 5000);
                // mediaRecorder.onstop = function (e: any) {
                //    const blob = new Blob(chunks, { type: "audio/webm" });
                //    chunks = [];
                //    var token = localStorage.getItem("OPENAI_API_KEY");
                //    if (!token || token.length < 10) {
                //        token = prompt("Please input OpenAI API key (stored in browser cache)", "");
                //        localStorage.setItem("OPENAI_API_KEY", token || "");
                //    }
                //    const formData = new FormData();
                //    formData.append("file", blob, "test.webm");
                //    formData.append("model", "whisper-1");
                //    const requestOptions = {
                //        method: "POST",
                //        headers: {
                //            Authorization: `Bearer ${token}`
                //        },
                //        body: formData
                //    };
                //    fetch("https://api.openai.com/v1/audio/transcriptions", requestOptions)
                //        .then(response => response.json())
                //        .then(data => {
                //            console.log(data);
                //        })
                //        .catch(error => console.log("Error:", error));
                // };
                // mediaRecorder.ondataavailable = function (e: any) { chunks.push(e.data); };
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
