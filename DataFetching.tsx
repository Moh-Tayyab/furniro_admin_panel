"use client";

import { atom } from "jotai";
import { Product } from "@/interface";
import { client } from "./sanity/lib/client";
import { useAtom } from "jotai";
export const data = atom<Product[]>([]);

const DataFetching = () => {
  const [, setProducts] = useAtom(data);

  try {
    const dataFetching = async () => {
      const query = `*[_type == "myproduct"]{
       name,
       tags,
       price,
       stock,
       dimensions,
       id,
       description,
       discount,
       originalPrice,
       "categoryName": category->name,
       "slug": slug.current,
       "imageUrl": image.asset->url,
       rating
     }`;
      const fetchedProducts: Product[] = await client.fetch(query);
      setProducts(fetchedProducts);
    };
    dataFetching();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return null;
};

export default DataFetching;