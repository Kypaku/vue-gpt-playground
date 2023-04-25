<template>
    <div class="app">
        <div class="text-2xl w-full text-center mt-10">
            <b>Vue.js GPT API Sample:</b>
        </div>
        <div class="main container mx-auto mt-10">
            <div class="mt-4">
                To get an API KEY you need to register new OPEN API account and
                then visit
                <a
                    href="https://platform.openai.com/account/api-keys"
                    target="_blank"
                >
                    https://platform.openai.com/account/api-keys
                </a>
            </div>
            <InputText
                v-model:value="apiKey"
                :label="'API Key:'"
                class="w-1/2 mt-4"
                @update:value="(val) => api.setApiKey(val)"
                placeholder="Paste a key here"
            />

            <button @click="showSettings">
                <span v-if="!settings" class="underline">Settings</span>
                <span v-else style="color: red">Close settings &#215;</span>
            </button>

            <OpenAITextSettings
                v-if="settings && tab === ''"
                v-model:value="textOpts"
            >
            </OpenAITextSettings>

            <OpenAIImageSettings
                v-if="settings && tab === 'image'"
                v-model:value="imageOpts.n"
            >
            </OpenAIImageSettings>

            <Tabs v-model:value="tab" :tabs="tabs" class="mt-8" />
            <div class="description mt-4">
                <a target="_blank" :href="currentGuide">API Guide</a>
            </div>

            <InputFile
                v-if="tab === 'audio' && !isLoading"
                @update:value="(val) => runTranscribe(val)"
                tab="tab"
                isTranscribing="isLoading"
            ></InputFile>

            <!--<div>
                <input
                    v-if="tab === 'audio' && !isLoading"
                    type="file"
                    @change="(event) => runTranscribe(event)"
                />
                {{ isLoading ? "Loading..." : "" }}
            </div>-->

            <SpeechRecording
                v-if="tab !== 'audio' && !isLoading"
                @setPrompt="setPrompt"
                @setLoading="setLoading"
            ></SpeechRecording>
            <div v-if="tab !== 'audio' && isLoading">Loading...</div>

            <InputTextarea
                v-if="tab !== 'audio'"
                tab="tab"
                isLoading
                v-model:value="prompt"
                @setPromt="(val) => $emit('update:value', val)"
                :label="'Prompt:'"
                class="w-1/2 mt-8"
                :rows="10"
            />
            <button
                v-if="tab !== 'audio'"
                @click="run"
                class="mt-2 bg-gray-300 px-2 py-1"
            >
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
import { defineComponent } from "@vue/runtime-core";
import InputText from "./components/misc/InputText.vue";
import InputTextarea from "./components/misc/InputTextarea.vue";
import Tabs, { ITab } from "./components/misc/Tabs.vue";
import OpenAITextSettings from "./components/openai/OpenAITextSettings.vue";
import OpenAIImageSettings from "./components/openai/OpenAIImageSettings.vue";
import SpeechRecording from "./components/audio/SpeechRecording.vue";
import InputFile from "./components/misc/InputFile.vue";
export default defineComponent({
    components: {
        Tabs,
        InputTextarea,
        InputText,
        OpenAITextSettings,
        OpenAIImageSettings,
        SpeechRecording,
        InputFile,
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
                { label: "Audio", value: "audio" },
            ] as ITab[],
            result: "",
            isLoading: false,
            waitResponse: true,
            prompt: "",
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
        setPrompt(data: string): void {
            this.prompt = data;
        },
        setLoading(): void {
            this.isLoading = !this.isLoading;
        },
        showSettings() {
            this.settings = !this.settings;
        },
        async runTranscribe(val: any) {
            if (!this.isLoading) {
                this.isLoading = true;
                try {
                    const blob = new Blob([val.target.files[0]], {
                        type: "audio/webm",
                    });
                    const formData = new FormData();
                    formData.append("file", blob, "test.webm");
                    formData.append("model", "whisper-1");
                    const token = localStorage.getItem("key");
                    const requestOptions = {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: formData,
                    };
                    const text = await this.api.transcribe(requestOptions);
                    this.result = text || "";
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
                        ](this.prompt, this.imageOpts.n);
                    } else {
                        res = await (this.api as any)[
                            handlers[this.tab] || "get"
                        ](this.prompt, this.textOpts);
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
});
</script>

<style lang="scss" scoped>
a {
    @apply underline text-blue-600 hover:text-blue-800;
}
</style>
