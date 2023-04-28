<template>
    <div class="app">
        <div class="text-2xl w-full text-center mt-10">
            <b>Vue.js GPT API Sample:</b>
        </div>
        <div class="description container mt-4">
            <a target="_blank" :href="currentGuide">API Guide</a>
        </div>

        <div class="main container mx-auto mt-6">
            <div class="settingsWrapper">
                <button @click="showApiKeyInput">
                    <span v-if="!apiKeyNeeded">Set API KEY</span>
                    <span v-else style="color: red"
                        >Hide api-key input &#215;</span
                    >
                </button>
                <div v-if="apiKeyNeeded" class="mt-4">
                    To get an API KEY you need to register new OPEN API account
                    and then visit
                    <a
                        href="https://platform.openai.com/account/api-keys"
                        target="_blank"
                    >
                        https://platform.openai.com/account/api-keys
                    </a>
                </div>
                <InputText
                    v-if="apiKeyNeeded"
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
            </div>

            <Tabs
                v-model:value="tab"
                :tabs="tabs"
                @click="clearResult()"
                class="mt-8"
            />

            <InputFile
                v-if="tab === 'audio'"
                @update:value="(val) => runTranscribe(val)"
            ></InputFile>
            <div v-if="isTranscribing">Transcribing...</div>

            <InputTextarea
                v-if="tab !== 'audio'"
                :showSpeechRecording="showSpeechRecording"
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
import InputFile from "./components/misc/InputFile.vue";
export default defineComponent({
    components: {
        Tabs,
        InputTextarea,
        InputText,
        OpenAITextSettings,
        OpenAIImageSettings,
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
            showSpeechRecording: true,
            isTranscribing: false,
            tabs: [
                { label: "Text", value: "" },
                // { label: "Code", value: "code" },
                { label: "Image", value: "image" },
                { label: "Audio", value: "audio" },
            ] as ITab[],
            result: "",
            isLoading: false,
            waitResponse: true,
            prompt: "",
            text: "",
            apiKey: process.env.OPENAI_API_KEY || "",
            api: new SimpleGPT({ key: process.env.OPENAI_API_KEY || "" }),
            apiKeyNeeded: false,
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
        showSettings() {
            this.settings = !this.settings;
        },
        showApiKeyInput() {
            this.apiKeyNeeded = !this.apiKeyNeeded;
        },
        clearResult() {
            this.result = "";
            this.prompt = "";
        },
        async runTranscribe(val: any) {
            if (!this.isTranscribing) {
                this.isTranscribing = true;
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
                    this.isTranscribing = false;
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

.description {
    text-align: right;
}
.settingsWrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    button {
        width: 170px;
        padding: 5px;
        border-radius: 5px;
        border: 1px solid #b2aeae;
        margin-top: 10px;
    }
}
</style>
