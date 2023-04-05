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
                <span v-if="!settings">Settings</span>
                <span v-else style="color: red">Close settings &#215;</span>
            </button>

            <TextQuerySettings
                v-if="settings && tab === ''"
                v-model:value="textOpts"
            >
            </TextQuerySettings>

            <ImageQuerySettings
                v-if="settings && tab === 'image'"
                v-model:value="imageOpts.n"
            >
            </ImageQuerySettings>

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
import { defineComponent } from "@vue/runtime-core";
import InputText from "./components/misc/InputText.vue";
import InputTextarea from "./components/misc/InputTextarea.vue";
import Tabs, { ITab } from "./components/misc/Tabs.vue";
import TextQuerySettings from "./components/settings/TextQuerySettings.vue";
import ImageQuerySettings from "./components/settings/ImageQuerySettings.vue";
export default defineComponent({
    components: {
        Tabs,
        InputTextarea,
        InputText,
        TextQuerySettings,
        ImageQuerySettings,
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
});
</script>

<style lang="scss" scoped>
a {
    @apply underline text-blue-600 hover:text-blue-800;
}
</style>
