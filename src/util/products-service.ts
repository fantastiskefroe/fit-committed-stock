import type {Product} from "@/types/product";
import type {Variant} from "@/types/variant";
import type {ProductDTO} from "@/types/productDTO";

export default {
    async getAll(): Promise<Product[]> {
        const maxCacheAge = 15 * 60 * 1000; // 15 min
        const data = loadFromCache();

        if (Date.now() - data.timestamp > maxCacheAge) {
            const productList = await fetchAll();
            saveToCache(productList);
            return productList
        } else {
            return loadFromCache().productList;
        }
    }
}

async function fetchAll(): Promise<Product[]> {
    return fetch('https://products.it.fantastiskefroe.dk/products')
        .then(value => value.json())
        .then((data : ProductDTO[]) => data.map(toProduct))
}

function toProduct(source: ProductDTO): Product {
    const variants: Variant[] = source.variants
        .map(variantDTO => {
            return {
                id: variantDTO.id, sku: variantDTO.sku, inventory: variantDTO.inventory,
            };
        });

    return {
        id: source.id,
        title: source.title,
        url: source.url,
        imgUrl: source.imageUrl,
        variants: variants,
        tags: source.tags
    };
}

function saveToCache(productList: Product[]): void {
    const data = {
        timestamp: Date.now(), productList
    };

    window.localStorage.setItem('productList', JSON.stringify(data));
}

function loadFromCache(): { timestamp: number, productList: Product[] } {
    const data = window.localStorage.getItem('productList');
    if (data == null) {
        return {
            timestamp: 0, productList: []
        };
    }

    return JSON.parse(data);
}
