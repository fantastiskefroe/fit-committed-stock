import type {Variant} from "@/types/variant";

export interface Product {
    id: string;
    title: string;
    url: string;
    imgUrl: string;
    variants: Variant[];
    tags: string[];
}