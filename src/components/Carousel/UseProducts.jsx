import { useEffect, useState } from "react";
import API from "../../Configs/ApiEndpoints";

export default function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchProducts = async () => {
      try {
        const res = await fetch(API.GET_SLIDESRS,
          {
            method: "GET", // or "POST" if your API expects POST
            credentials: "include", // include cookies if needed
          }
        );
        const data = await res.json(); // parse JSON
        setProducts(data); // save to state
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts(); // call the async function
  }, []);

  return products;
}
