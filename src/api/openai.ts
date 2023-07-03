import { startsWith, replace, set } from "lodash";
import { Configuration, OpenAIApi, CreateCompletionRequest, CreateChatCompletionRequest, CreateImageRequestSizeEnum, Model } from "openai";
import https from "https";
// const request = require('request')
import request from "request";
import AbortController from "abort-controller";

const abortController = new AbortController();
class CustomFormData extends FormData {
    getHeaders() {
        return {};
    }
}

export const maxTokensModels = {
    "gpt-3.5-turbo": 4096,
    "gpt-4": 8192,
    "gpt-3.5-turbo-16k": 16384
};

export default class SimpleGPT {
    protected _key: string
    protected _configuration: Configuration | null
    protected _openai: OpenAIApi | null
    protected req: any
    protected reader: any

    public get chatModels(): string[] {
        return ["gpt-3.5-turbo", "gpt-4"];
    }

    public get defaultOptsGPT(): Partial<CreateCompletionRequest> {
        return {
            model: "gpt-3.5-turbo-0613",
            temperature: 0,
            max_tokens: 200,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
        };
    }

    constructor ({ key }: {key: string}) {
        this._key = "";
        this._configuration = null;
        this._openai = null;
        this.setApiKey(key);
    }

    async transcribe(formData: FormData) {
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this._key}`,
            },
            body: formData,
        };
        const response = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            requestOptions
        ).then((response) => {
            if (response.ok) {
                return response?.json?.();
            } else {
                Promise.reject(response);
            }
        });
        return response.text;
    }

    async getStream(prompt: string, fData: (delta: string, json: {[key: string]: any}, raw: any) => any, fEnd: any, opts?: Partial<CreateCompletionRequest & CreateChatCompletionRequest>): Promise<void> {
        return new Promise((resolve, reject) => {
            const model = opts?.model || this.defaultOptsGPT.model || "";

            const isChatModel = this.chatModels.find((chatModel) => model.includes(chatModel));
            const _prompt = (prompt || opts?.prompt);
            const messages = opts?.messages || [{ role: "user", content: _prompt as string }];

            const endpoint = isChatModel ? "/v1/chat/completions" : "/v1/completions";
            const signal = abortController.signal;

            const bodyRaw = {
                model,
                prompt: isChatModel ? undefined : _prompt,
                messages: isChatModel ? messages : undefined,
                temperature: opts?.temperature || this.defaultOptsGPT.temperature,
                max_tokens: opts?.max_tokens || this.defaultOptsGPT.max_tokens || 0,
                top_p: opts?.top_p || 1,
                frequency_penalty: opts?.frequency_penalty || this.defaultOptsGPT.frequency_penalty,
                presence_penalty: opts?.presence_penalty || this.defaultOptsGPT.presence_penalty,
                stream: opts?.stream || true,
                logit_bias: opts?.logit_bias || {},
                function_call: opts?.function_call || undefined,
                functions: opts?.functions || undefined,
            };
            const body = JSON.stringify(bodyRaw);

            fetch("https://api.openai.com" + endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + this._key
                },
                body: body,
            }).then(async (response) => {
                this.reader = response.body?.pipeThrough(new TextDecoderStream()).getReader();

                const choices = [];

                const cancelled = false;
                while (true) {
                    if (!this.reader) break;
                    const { value, done } = await this.reader.read();

                    if (done) {
                        break;
                    }

                    if (value.startsWith("{")) {
                        await this.reader.cancel();

                        // As far as I can tell, if the response is an object, then it is an unrecoverable error.
                        throw new Error(value);
                    }
                    const chunks = value.split("\n").map((chunk: any) => chunk.trim()).filter(Boolean);

                    for (const chunk of chunks) {
                        if (done) {
                            break;
                        }

                        if (chunk === "") {
                            continue;
                        }

                        if (chunk === "data: [DONE]") {
                            await this.reader.cancel();

                            break;
                        }

                        if (!chunk.startsWith("data: ")) {
                            throw new Error(`Unexpected message: ${chunk}`);
                        }

                        try {
                            const responseChunk = JSON.parse(chunk.toString().slice("data: ".length));

                            fData(responseChunk.choices?.[0]?.delta?.content || '', responseChunk, chunk);
                        } catch (e) {
                            throw new Error(`Unexpected message: ${chunk}`);
                        }
                    }
                    resolve();
                }
            });
        });
    }

    abortStream() {
        this.reader.cancel();
    }

    async get(prompt: string, opts?: Partial<CreateCompletionRequest & CreateChatCompletionRequest>): Promise<null | string[]> {
        if (!this._openai) return null;
        const model = opts?.model || this.defaultOptsGPT.model || "";
        const isChatModel = this.chatModels.find((chatModel) => model.includes(chatModel));
        const _prompt = (prompt || opts?.prompt);
        const messages = opts?.messages || [{ role: "user", content: _prompt as string }];
        const response = await this._openai[isChatModel ? "createChatCompletion" : "createCompletion"]({
            model,
            prompt: isChatModel ? undefined : _prompt,
            messages: isChatModel ? messages : undefined,
            temperature: opts?.temperature || this.defaultOptsGPT.temperature,
            max_tokens: opts?.max_tokens || this.defaultOptsGPT.max_tokens || 0,
            top_p: opts?.top_p || 1,
            frequency_penalty: opts?.frequency_penalty || this.defaultOptsGPT.frequency_penalty,
            presence_penalty: opts?.presence_penalty || this.defaultOptsGPT.presence_penalty,
        } as any);
        return (response?.data?.choices as any)?.map((choice: any) => choice.text || choice.message?.content).filter(Boolean) as string[];
    }

    async getCompletions(prompt: string, opts?: Partial<CreateCompletionRequest>): Promise<null | string[]> {
        if (!this._openai) return null;
        const response = await this._openai.createCompletion({
            model: opts?.model || "gpt-3.5-turbo-0613",
            prompt: prompt || opts?.prompt,
            temperature: opts?.temperature || 0,
            max_tokens: opts?.max_tokens || 256,
            top_p: opts?.top_p || 1,
            frequency_penalty: opts?.frequency_penalty || 0,
            presence_penalty: opts?.presence_penalty || 0,
        });
        return response.data.choices.map((choice) => choice.text).filter(Boolean) as string[];
    }

    async getFirst(prompt: string, opts?: Partial<CreateCompletionRequest & CreateChatCompletionRequest>): Promise<string | undefined> {
        return (await this.get(prompt, opts))?.[0];
    }

    async getCode(prompt: string, opts?: Partial<CreateCompletionRequest>): Promise<null | string[]> {
        if (!this._openai) return null;
        const response = await this._openai.createCompletion({
            model: opts?.model || "code-davinci-002",
            prompt: prompt || opts?.prompt,
            temperature: opts?.temperature || 0,
            max_tokens: opts?.max_tokens || 256,
            top_p: opts?.top_p || 1,
            frequency_penalty: opts?.frequency_penalty || 0,
            presence_penalty: opts?.presence_penalty || 0,
        });
        return response.data.choices.map((choice) => choice.text).filter(Boolean) as string[];
    }

    async getCodeFirst(prompt: string, opts?: Partial<CreateCompletionRequest>): Promise<string | undefined> {
        return (await this.getCode(prompt, opts))?.[0];
    }

    async getImages(prompt: string, n = 1, size: (256 | 512 | 1024) = 512): Promise<string[]> {
        const response = await this._openai?.createImage({
            prompt,
            n,
            size: `${size}x${size}` as CreateImageRequestSizeEnum,
        });
        return response?.data?.data.map((responseOne) => responseOne.url || "") || [];
    }

    async getImage(prompt: string, size: (256 | 512 | 1024) = 512): Promise<string | undefined> {
        return (await this.getImages(prompt, 1, size))?.[0];
    }

    setApiKey(key: string) {
        this._key = key;
        this._configuration = new Configuration({
            apiKey: this._key,
        });
        this._openai = new OpenAIApi(this._configuration);
    }

    async getModels(): Promise<null | string[]> {
        if (!this._openai) return null;
        const response = await this._openai.listModels();
        return response.data.data.map((datum) => datum.id) || null;
    }
}
