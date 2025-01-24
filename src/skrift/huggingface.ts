import { AutoModel } from "@huggingface/transformers";

export const HuggingFace = {
    preload: async () => {
        const models = Object.values(HuggingFace.models);
        for (const model of models) {
            AutoModel.from_pretrained(model);
        }
    },

    models: {
        sentenceTransformer: "Xenova/all-MiniLM-L6-v2"
    }
}