<template>
    <div class="app">
        <div class="text-4xl w-full text-center mt-10">
            <b>Vue.js GPT API Sample:</b>
        </div>
        <div class="main container mx-auto mt-10">
            <InputAPIKey v-model:value="apiKey" @update:value="(val) => api.setApiKey(val)" :show-warn="true" :use-local-storage="true"/>

            <button @click="showSettings">
                <span v-if="!settings">Settings</span>
                <span v-else style="color: red">Close settings &#215;</span>
            </button>

            <OpenAITextSettings
                v-if="settings && tab === ''"
                v-model:value="textOpts"
            />

            <OpenAIImageSettings
                v-if="settings && tab === 'image'"
                v-model:value="imageOpts.n"
            />

            <Tabs v-model:value="tab" :tabs="tabs" class="mt-8" />
            <div class="description mt-4">
                <a target="_blank" :href="currentGuide">API Guide</a>
            </div>
            <InputTextarea
                v-model:value="promt"
                :label="'Promt:'"
                class="w-1/2 mt-8"
                :rows="10"
            />
            <button @click="run" class="mt-2 bg-gray-300 px-2 py-1">
                {{ isLoading ? "Loading..." : "Run" }}
            </button>
            <div class="image-wrapper" v-if="tab === 'image'">
                <span>Result:</span>
                <img :src="result" alt="result" v-if="result" />
            </div>
            <InputTextarea
                v-else
                v-model:value="result"
                :label="'Result:'"
                disabled
                class="mt-8 w-1/2"
                :rows="10"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import SimpleGPT from "./api/openai";
    import * as fs from "fs";
    import { defineComponent } from "@vue/runtime-core";
    import InputTextarea from "./components/misc/InputTextarea.vue";
    import Tabs, { ITab } from "./components/misc/Tabs.vue";
    import OpenAITextSettings from "./components/openai/OpenAITextSettings.vue";
    import OpenAIImageSettings from "./components/openai/OpenAIImageSettings.vue";
    import InputAPIKey from "@/components/openai/InputAPIKey.vue";
    export default defineComponent({
        components: {
            InputAPIKey,
            Tabs,
            InputTextarea,
            OpenAITextSettings,
            OpenAIImageSettings,
        },
        data() {
            return {
                guides: {
                    code: "https://platform.openai.com/docs/guides/code",
                    text: "https://platform.openai.com/docs/guides/completion",
                    image: "https://platform.openai.com/docs/guides/images/introduction",
                },
                settings: false,
                textOpts: {
                    temperature: 0,
                    max_tokens: 200,
                    n: 1,
                },
                imageOpts: {
                    n: 1,
                },
                tab: "",
                tabs: [
                    { label: "Text", value: "" },
                    { label: "Code", value: "code" },
                    { label: "Image", value: "image" },
                ] as ITab[],
                result: "",
                isLoading: false,
                waitResponse: true,
                promt: "",
                apiKey: process.env.OPENAI_API_KEY || "",
                api: new SimpleGPT({ key: process.env.OPENAI_API_KEY || "" }),
            };
        },
        computed: {
            currentGuide(): string {
                return (
                    (this.guides as { [key: string]: string })[this.tab] ||
                    this.guides.text
                );
            },
        },
        methods: {
            showSettings() {
                this.settings = !this.settings;
            },
            async runTranscribe(val: any) {
                console.log(val);
                if (!this.isLoading) {
                    this.isLoading = true;

                    // const fileBuffer = fs.readFileSync(val);
                    // const blob = new Blob([fileBuffer], { type: "audio/mp3" });
                    // const file = new File([blob], val, { type: blob.type });
                    const audioObj = new Audio(val);
                    try {
                        let res: any = null;
                        res = await (this.api as any).transcribe(audioObj);

                        this.result = res || "";
                    } catch (e) {
                        console.error("App error: " + e);
                    } finally {
                        this.isLoading = false;
                    }
                }
            },
            async run() {
                if (!this.isLoading) {
                    this.isLoading = true;
                    const handlers = {
                        code: "getCodeFirst",
                        image: "getImages",
                    } as { [key: string]: string };
                    try {
                        let res: any = null;
                        if (this.tab === "image") {
                            res = await (this.api as any)[
                                handlers[this.tab] || "getImages"
                            ](this.promt, this.imageOpts.n);
                        } else {
                            res = await (this.api as any)[
                                handlers[this.tab] || "get"
                            ](this.promt, this.textOpts);
                        }
                        this.result = res || "";
                    } catch (e) {
                        console.error("App error: " + e);
                    } finally {
                        this.isLoading = false;
                    }
                }
            },
        },

        mounted () {
            if (navigator.mediaDevices.getUserMedia) {
                const constraints = { audio: true };
                let chunks = [] as any;
                const onSuccess = function (stream: any) {
                    const mediaRecorder = new (window as any).MediaRecorder(stream);
                    mediaRecorder.start();
                    setTimeout(() => {
                        mediaRecorder.stop();
                    }, 5000);
                    mediaRecorder.onstop = function (e: any) {
                        const blob = new Blob(chunks, { type: "audio/webm" });
                        chunks = [];
                        var token = localStorage.getItem("OPENAI_API_KEY");
                        if (!token || token.length < 10) {
                            token = prompt("Please input OpenAI API key (stored in browser cache)", "");
                            localStorage.setItem("OPENAI_API_KEY", token || "");
                        }
                        const formData = new FormData();
                        formData.append("file", blob, "test.webm");
                        formData.append("model", "whisper-1");
                        const requestOptions = {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${token}`
                            },
                            body: formData
                        };
                        fetch("https://api.openai.com/v1/audio/transcriptions", requestOptions)
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                            })
                            .catch(error => console.log("Error:", error));
                    };
                    mediaRecorder.ondataavailable = function (e: any) { chunks.push(e.data); };
                };
                const onError = function (err: any) { console.log("The following error occured: " + err); };
                navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
            }
        }
    });
</script>

<style lang="scss" scoped>
    .app{
        max-width: 900px;
        margin: 0 auto;
    }

    a {
        @apply underline text-blue-600 hover:text-blue-800;
    }
</style>
