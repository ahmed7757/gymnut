import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function handleFoodSearch(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    if (!query) {
        return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }
    try {
        const params: any = {
            search_terms: query,
            fields: "product_name,image_url,nutriments,id,categories_tags",
            json: true,
        };
        if (query.toLowerCase().includes("chicken")) {
            params.categories_tags = "chicken";
        }
        const response = await axios.get(
            `https://world.openfoodfacts.org/api/v2/search`,
            { params }
        );
        const data = response.data;
        if (!data.products || data.products.length === 0) {
            return NextResponse.json({ error: "No food found" }, { status: 404 });
        }
        const result = data.products.slice(0, 10).map((item: any) => ({
            id: item.id,
            name: item.product_name,
            image: item.image_url,
            calories: item.nutriments?.energy_kcal_100g,
            protein: item.nutriments?.proteins_100g,
            carbs: item.nutriments?.carbohydrates_100g,
            fat: item.nutriments?.fat_100g,
        }));
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json(
            { error: "Failed to fetch food data", details: error?.message },
            { status: 500 }
        );
    }
}


