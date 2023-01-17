import type {VariantDTO} from "@/types/variantDTO";

export interface ProductDTO {
    id: number;
    title: string;
    handle: string;
    url: string;
    imageUrl: string;
    variants: VariantDTO[];
    tags: string[];
}
