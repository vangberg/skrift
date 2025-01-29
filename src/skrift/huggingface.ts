import { pipeline, FeatureExtractionPipeline } from "@huggingface/transformers";

export const Pipelines = {
    preload: async () => {
        await getSentenceTransformerPipeline();
    },
}

let sentenceTransformerPipeline: FeatureExtractionPipeline | null = null;

export const getSentenceTransformerPipeline = async () => {
    if (sentenceTransformerPipeline === null) {
        sentenceTransformerPipeline = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2",
            { dtype: "fp32" }
        );
    }
    return sentenceTransformerPipeline;
}