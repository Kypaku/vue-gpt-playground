import { Configuration, OpenAIApi, CreateCompletionRequest, CreateCompletionResponse } from "openai";

export default {
    key: "",
    configuration: null as Configuration | null,
    openai: null as OpenAIApi | null,
    async get(promt: string, opts?: CreateCompletionRequest): Promise<null | string[]> {
        if (!this.openai) return null;
        const response = await this.openai.createCompletion({
            model: opts?.model || "text-davinci-003",
            prompt: promt || opts?.prompt,
            temperature: opts?.temperature || 0,
            max_tokens: opts?.max_tokens || 60,
            top_p: opts?.top_p || 1,
            frequency_penalty: opts?.frequency_penalty || 0.5,
            presence_penalty: opts?.presence_penalty || 0,
        });
        return response.data.choices.map((choice) => choice.text).filter(Boolean) as string[];
    },
    async getFirst(promt: string, opts?: CreateCompletionRequest): Promise<string | undefined> {
        return (await this.get(promt, opts))?.[0];
    },
    async getCode(promt: string, opts?: CreateCompletionRequest): Promise<null | string[]> {
        if (!this.openai) return null;
        const response = await this.openai.createCompletion({
            model: opts?.model || "code-davinci-002",
            prompt: promt || opts?.prompt,
            temperature: opts?.temperature || 0,
            max_tokens: opts?.max_tokens || 256,
            top_p: opts?.top_p || 1,
            frequency_penalty: opts?.frequency_penalty || 0,
            presence_penalty: opts?.presence_penalty || 0,
        });
        return response.data.choices.map((choice) => choice.text).filter(Boolean) as string[];
    },
    async getCodeFirst(promt: string, opts?: CreateCompletionRequest): Promise<string | undefined> {
        return (await this.getCode(promt, opts))?.[0];
    },
    setApiKey(key: string) {
        this.key = key;
        this.configuration = new Configuration({
            apiKey: this.key,
        });
        this.openai = new OpenAIApi(this.configuration);
    },
};
