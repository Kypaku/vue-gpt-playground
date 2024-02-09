<template>
    <div class="app pt-10">
        <div class="text-5xl w-full text-center">
            <b>Vue.js OpenAI API Playground</b>
        </div>

        <div class="main container mx-auto mt-6 pl-1 pb-3">
            <div class="description container mx-auto mt-8 pr-2 text-xl">
                An example project based on Vue CLI to demonstrate basic OpenAI GPT possibilities.<br/> Create your own Chat GPT!
                <div>
                    <a class="text-base"  target="_blank" :href="currentGuide">OpenAI API Guide</a>
                </div>
                <div>
                    <a class="text-base" target="_blank" :href="'https://github.com/Kypaku/vue-gpt-playground'">GitHub Project</a>
                </div>
                <div>
                    <a class="text-base" target="_blank" :href="'https://www.npmjs.com/package/gpt-simple-api-ts'">API</a>
                </div>
            </div>
            <APIKey v-model:value="apiKey" @update:value="(val) => updateApiKey(val)"/>
            <Accordeon title="Settings" v-model:value="settings" class="mt-3 api-key" >
                <OpenAITextSettings
                    v-if="settings"
                    v-model:value="textOpts"
                    :models="models"
                >
                </OpenAITextSettings>
                <button v-if="settings" class="save-button"  @click="saveSettings">
                    {{ savedSettings ? "Saved!" : "Save" }}
                </button>
            </Accordeon>

            <Tabs
                v-model:value="tab"
                :tabs="tabs"
                @click="clearResult()"
                class="mt-10 w-full"
            />

            <InputFile
                class="mt-4"
                :accept="['.m4a', '.mp3', '.webm', '.mp4', '.mpga', '.wav', '.mpeg']"
                v-if="tab === 'audio'"
                v-model:value="audioFile"
            ></InputFile>
            <div class="mt-4">
                <InputText v-model:value="whisperLanguage" class="language-input" :placeholder="'empty for auto'"  v-if="tab === 'audio'" :suggestions="langCodes" label="Input language (code):" />
            </div>

            <InputTextarea
                v-if="tab !== 'audio'"
                :showSpeechRecording="showSpeechRecording"
                :apiKeyNeeded="apiKeyNeeded"
                isLoading
                v-model:value="prompt"
                @setPromt="(val) => $emit('update:value', val)"
                :label="'Prompt:'"
                class="w-full rounded-lg mt-8"
                :rows="10"
            />
            <div class="tokens-left text-xs" v-if="!tab">
                <span>Tokens count (approximate): </span>
                <span>{{ tokensCount }}</span>
            </div>
            <button
                v-if="tab === 'audio'"
                :disabled="isTranscribing || !audioFile"
                @click="runTranscribe(audioFile)"
                class="mt-2 bg-gray-300 run-btn px-8 py-2 text-white rounded"
            >
                <b>{{ isLoading ?  "Loading..." : "Run" }}</b>

            </button>
            <button
                v-else
                :disabled="tab === 'image' ? isLoading : (!textOpts.stream && isLoading)"
                @click="run()"
                class="mt-2 bg-gray-300 run-btn px-8 py-2 text-white rounded"
            >
                <b>{{ isLoading ? (tab === 'image' || !textOpts.stream ? "Loading..." : 'Stop') : "Run" }}</b>

            </button>
            <div class="image-wrapper" v-if="tab === 'image' && result" ref="result">
                <span>Result:</span>
                <img :src="result" alt="result" />
            </div>
            <InputTextarea
                v-else-if="result"
                v-model:value="result"
                :label="'Result:'"
                disabled
                class="mt-8"
                :rows="10"
                ref="result"
            />
            <Error :value="error" v-if="error" class="mt-2"  />
        </div>
    </div>
</template>

<script lang="ts">
    import SimpleGPT from "./api/openai";
    import { defineComponent } from "@vue/runtime-core";
    import Error from "./components/misc/Error.vue";
    import InputTextarea from "./components/misc/InputTextarea.vue";
    import Tabs, { ITab } from "./components/misc/Tabs.vue";
    import OpenAITextSettings from "./components/openai/OpenAITextSettings.vue";
    import InputFile from "./components/misc/InputFile.vue";
    import Accordeon from "./components/misc/Accordeon.vue";
    import ls from "local-storage";
    import InputText, { InputTextSuggestion } from "./components/misc/InputText.vue";
    import { languageCodes } from "./helpers";
    import APIKey from "@/components/partials/APIKey.vue";

    export default defineComponent({
        components: {
            APIKey,
            InputText,
            Tabs,
            InputTextarea,
            OpenAITextSettings,
            InputFile,
            Accordeon,
            Error,
        },
        data() {
            return {
                models: [] as string[],
                audioFile: null,
                savedSettings: false,
                whisperLanguage: "",
                error: "",
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
                    model: "gpt-3.5-turbo-0301",
                    stream: true,
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
                    { label: "Embeddings", value: "embeddings" },
                ] as ITab[],
                result: "",
                isLoading: false,
                waitResponse: true,
                prompt: "",
                text: "",
                apiKey: process.env.OPENAI_API_KEY || ls("openAIKey") || "",
                api: new SimpleGPT({ key: process.env.OPENAI_API_KEY || "" }),
                apiKeyNeeded: false,
            };
        },
        computed: {
            tokensCount(): number {
                return this.prompt.length / 4;
            },

            langCodes(): InputTextSuggestion[] {
                return languageCodes.map((code) => ({
                    name: code,
                    value: code,
                }));
            },

            currentGuide(): string {
                return (
                    (this.guides as { [key: string]: string })[this.tab] ||
                    this.guides.text
                );
            },
        },
        methods: {
            async updateApiKey(val: string) {
                // (api.setApiKey(val), (apiKeyNeeded = false))
                this.apiKey = val;
                this.api.setApiKey(val);
                this.models = (await this.api.getModels()) || [];
            },

            stopRunning() {
                if (this.apiKeyNeeded) {
                    alert("Enter your API KEY");
                    return null;
                }
            },
            setPrompt(data: string): void {
                this.prompt = data;
            },
            showSettings() {
                this.settings = !this.settings;
            },
            saveSettings() {
                localStorage.setItem("settings", JSON.stringify(this.textOpts));
                this.savedSettings = true;
                setTimeout(() => {
                    this.savedSettings = false;
                }, 5000);
            },
            clearResult() {
                this.result = "";
                this.prompt = "";
                this.error = "";
            },
            async runTranscribe(val: any) {
                if (!this.apiKey) {
                    alert("You need to set your API KEY before running");
                    return null;
                }
                if (!this.isTranscribing) {
                    this.error = "";
                    this.isTranscribing = true;
                    try {
                        const blob = new Blob([val.target.files[0]], {
                            type: "audio/webm",
                        });
                        const formData = new FormData();
                        formData.append("file", blob, "test.webm");
                        formData.append("model", "whisper-1");
                        formData.append("language", this.whisperLanguage);

                        const text = await this.api.transcribe(formData);
                        this.result = text || "";
                        setTimeout(() => {
                            (this.$refs?.result as any)?.scrollIntoView?.();
                        }, 0);
                    } catch (e: any) {
                        console.error("App error: " + e, e.response);
                        if (e?.response?.data?.error?.message) {
                            this.error = e?.response.data.error.message;
                        }
                    } finally {
                        this.isTranscribing = false;
                    }
                }
            },
            scrollToResult() {
                setTimeout(() => {
                    (this.$refs?.result as any)?.scrollIntoView?.();
                    (this.$refs?.result as any)?.$el?.scrollIntoView?.();
                }, 0);
            },
            async run() {
                if (!this.apiKey) {
                    alert("You need to set your API KEY before running");
                    return null;
                }
                if (!this.isLoading) {
                    this.result = "";
                    this.error = "";
                    this.isLoading = true;
                    try {
                        let res: any = null;
                        if (this.tab === "image") {
                            res = await this.api.getImages(this.prompt, this.imageOpts.n);
                            this.result = res || "";
                            this.scrollToResult();
                        } else if (this.tab === "embeddings") {
                            res = await this.api.getEmbedding({input: this.prompt});
                            this.result = res || "";
                            this.scrollToResult();
                        } else if (!this.textOpts.stream) {
                            res = await this.api.get(this.prompt, this.textOpts);
                            this.result = res || "";
                            this.scrollToResult();
                        } else {
                            const fData = (delta: string, json: any, raw: string) => {
                                try {
                                    console.log("fData");
                                    this.result += delta || "";
                                    this.scrollToResult();
                                } catch (e) {
                                    console.error("Error parsing data", e, raw);
                                }
                            };
                            const fEnd = () => {
                                console.log("END");
                            };
                            const stream = await this.api.getStream(this.prompt, fData, fEnd, this.textOpts); // await openAIStream({messages: [{role: 'user', content: this.prompt}], stream: true, model: this.textOpts?.model} as any, this.apiKey);
                            console.log("END stream");
                        }
                    } catch (e: any) {
                        console.error("App error: " + e);
                        if (e.error) {
                            this.error = e.error.message || `Error code: ${e.error.code}`;
                        }
                        if (e?.response?.data?.error?.message) {
                            this.error = e?.response.data.error.message;
                        }
                    } finally {
                        this.isLoading = false;
                    }
                } else {
                    this.api.abortStream();
                    this.isLoading = false;
                }
            },
        },
        async created() {
            this.apiKey && this.api.setApiKey(this.apiKey);
            this.models = (await this.api.getModels()) || [];
        },
        mounted() {
            const savedSettings = localStorage.getItem("settings");
            if (savedSettings === null) return;
            this.textOpts = JSON.parse(savedSettings);

            const savedKey = localStorage.getItem("key");
            if (!savedKey) this.apiKeyNeeded = true;
        },

        watch: {
        },
    });
</script>

<style lang="scss" scoped>
    .language-input{
        width: 200px;
    }

    .save-button{
        background: rgb(102, 102, 102);
        color: white;
        border-radius: 4px;
        padding: 2px 8px;
        margin-top: 16px;
    }

    .run-btn{
        background: #7759de;
        &:disabled {
            opacity: 0.6;
            pointer-events: none;
        }
    }

    ::v-deep .api-key{
        width: 375px;
        max-width: 100%;
        .tab__link {
            background: #e0f7ea;
            display: flex;
            align-items: center;
            border-radius: 4px;
        }
    }

    .main{
        max-width: 900px;
    }
    a {
        @apply underline text-blue-500 hover:text-blue-800;
    }
    .app {
        background: linear-gradient(to bottom, rgb(255 255 255), rgb(206 255 228));
        min-height: 100vh;
    }

    .description {
        text-align: left;
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
