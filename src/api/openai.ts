import {
    Configuration,
    OpenAIApi,
    CreateCompletionRequest,
    CreateCompletionResponse,
    CreateImageRequestSizeEnum,
} from "openai";

class CustomFormData extends FormData {
    getHeaders() {
        return {};
    }
}

export default class SimpleGPT {
    protected _key: string;
    protected _configuration: Configuration | null;
    protected _openai: OpenAIApi | null;

    constructor({ key }: { key: string }) {
        this._key = "";
        this._configuration = null;
        this._openai = null;
        this.setApiKey(key);
    }

    async transcribe(options: any) {
        try {
            const response = await fetch(
                "https://api.openai.com/v1/audio/transcriptions",
                options
            );
            const json = await response.json();
            console.log(json);
            return json.text;
        } catch (err) {
            console.log(err);
        }
    }

    async get(
        prompt: string,
        opts?: Partial<CreateCompletionRequest>
    ): Promise<null | string[]> {
        if (!this._openai) return null;
        const response = await this._openai.createCompletion({
            model: opts?.model || "text-davinci-003",
            prompt: prompt || opts?.prompt,
            temperature: opts?.temperature || 0,
            max_tokens: opts?.max_tokens || 60,
            top_p: opts?.top_p || 1,
            n: opts?.n || 1,
            frequency_penalty: opts?.frequency_penalty || 0.5,
            presence_penalty: opts?.presence_penalty || 0,
        });
        return response.data.choices
            .map((choice) => choice.text)
            .filter(Boolean) as string[];
    }

    async getFirst(
        promt: string,
        opts?: Partial<CreateCompletionRequest>
    ): Promise<string | undefined> {
        return (await this.get(promt, opts))?.[0];
    }

    async getCode(
        prompt: string,
        opts?: Partial<CreateCompletionRequest>
    ): Promise<null | string[]> {
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
        return response.data.choices
            .map((choice) => choice.text)
            .filter(Boolean) as string[];
    }

    async getCodeFirst(
        prompt: string,
        opts?: Partial<CreateCompletionRequest>
    ): Promise<string | undefined> {
        return (await this.getCode(prompt, opts))?.[0];
    }

    async getImages(
        prompt: string,
        n = 1,
        size: 256 | 512 | 1024 = 512
    ): Promise<string[]> {
        const response = await this._openai?.createImage({
            prompt,
            n,
            size: `${size}x${size}` as CreateImageRequestSizeEnum,
        });
        return (
            response?.data?.data.map((responseOne) => responseOne.url || "") ||
            []
        );
    }

    async getImage(
        prompt: string,
        size: 256 | 512 | 1024 = 512
    ): Promise<string | undefined> {
        return (await this.getImages(prompt, 1, size))?.[0];
    }

    setApiKey(key: string) {
        const savedKey = window.localStorage.getItem("key");
        if (savedKey) {
            this._key = savedKey;
        } else if (key) {
            window.localStorage.setItem("key", key);
            this._key = key;
        }
        this._configuration = new Configuration({
            apiKey: this._key,
            formDataCtor: CustomFormData,
        });
        this._openai = new OpenAIApi(this._configuration);
    }
}
