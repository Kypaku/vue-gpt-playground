
import { Configuration, OpenAIApi, CreateCompletionRequest, CreateChatCompletionRequest, CreateImageRequestSizeEnum } from "openai";
class CustomFormData extends FormData {
    getHeaders() {
        return {};
    }
}

export default class SimpleGPT {
    protected _key: string
    protected _configuration: Configuration | null
    protected _openai: OpenAIApi | null

    public get chatModels(): string[] {
        return ["gpt-3.5-turbo", "gpt-3.5-turbo-0301", "gpt-4", "gpt-4-0314"];
    }

    public get defaultOptsGPT(): Partial<CreateCompletionRequest> {
        return {
            model: "gpt-3.5-turbo-0301",
            temperature: 0,
            max_tokens: 60,
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

    async transcribe(options: any) {
        const response = await fetch(
            "https://api.openai.com/v1/audio/transcriptions",
            options
        ).then((response) => {
            if (response.ok) {
                return response?.json?.();
            } else {
                Promise.reject(response)
            }
        });
        return response.text
    }

    async get(prompt: string, opts?: Partial<CreateCompletionRequest & CreateChatCompletionRequest>): Promise<null | string[]> {
        if (!this._openai) return null;
        const model = opts?.model || this.defaultOptsGPT.model || "";
        const isChatModel = this.chatModels.indexOf(model) >= 0;
        const _prompt = (prompt || opts?.prompt);
        const messages = opts?.messages || [{ role: "user", content: _prompt as string }];
        const response = await this._openai[isChatModel ? "createChatCompletion" : "createCompletion"]({
            model,
            prompt: isChatModel ? undefined : _prompt,
            messages: messages,
            temperature: opts?.temperature || this.defaultOptsGPT.temperature,
            max_tokens: opts?.max_tokens || this.defaultOptsGPT.max_tokens || 0,
            top_p: opts?.top_p || 1,
            frequency_penalty: opts?.frequency_penalty || this.defaultOptsGPT.frequency_penalty,
            presence_penalty: opts?.presence_penalty || this.defaultOptsGPT.presence_penalty,
        });
        return (response?.data?.choices as any)?.map((choice: any) => choice.text || choice.message?.content).filter(Boolean) as string[];
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
}
