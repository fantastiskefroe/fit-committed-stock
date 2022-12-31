import type {VariantDTO} from "@/types/variantDTO";

export interface ProductDTO {
    id: string;
    title: string;
    handle: string;
    url: string;
    imageUrl: string;
    variants: VariantDTO[];
}
