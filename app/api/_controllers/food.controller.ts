import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { withRateLimit, rateLimiters } from "@/lib/rateLimiter";
import { withCache, caches, cacheKeys } from "@/lib/cache";
import { InputSanitizer } from "@/lib/sanitization";

export async function handleFoodSearch(req: NextRequest) {
    return withRateLimit(req, rateLimiters.foodSearch, async () => {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json({ error: "Query is required" }, { status: 400 });
        }

        try {
            // Sanitize the search query
            const sanitizedQuery = InputSanitizer.sanitizeString(query, {
                maxLength: 100,
                allowSpecialChars: false
            });

            // Create cache key
            const cacheKey = cacheKeys.foodSearch(sanitizedQuery);

            // Try to get from cache first
            const result = await withCache(
                caches.food,
                cacheKey,
                async () => {
                    const params: any = {
                        search_terms: sanitizedQuery,
                        fields: "product_name,image_url,nutriments,id,categories_tags",
                        json: true,
                    };

                    if (sanitizedQuery.toLowerCase().includes("chicken")) {
                        params.categories_tags = "chicken";
                    }

                    const response = await axios.get(
                        `https://world.openfoodfacts.org/api/v2/search`,
                        {
                            params,
                            timeout: 10000 // 10 second timeout
                        }
                    );

                    const data = response.data;
                    if (!data.products || data.products.length === 0) {
                        throw new Error("No food found");
                    }

                    return data.products.slice(0, 10).map((item: any) => ({
                        id: item.id,
                        name: item.product_name,
                        image: item.image_url,
                        calories: item.nutriments?.energy_kcal_100g,
                        protein: item.nutriments?.proteins_100g,
                        carbs: item.nutriments?.carbohydrates_100g,
                        fat: item.nutriments?.fat_100g,
                    }));
                },
                30 * 60 * 1000 // 30 minutes cache
            );

            return NextResponse.json(result);
        } catch (error: any) {
            console.error("Food search error:", error);

            if (error.message === "No food found") {
                return NextResponse.json({ error: "No food found" }, { status: 404 });
            }

            if (error.message.includes('Invalid input')) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }

            return NextResponse.json(
                { error: "Failed to fetch food data", details: error?.message },
                { status: 500 }
            );
        }
    });
}


