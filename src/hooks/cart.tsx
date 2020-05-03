import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const storageName = '@GoMarketplace:cart';

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.removeItem(storageName);
      const value = await AsyncStorage.getItem(storageName);

      if (value) {
        setProducts(JSON.parse(value));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    product => {
      const newProducts = [...products];
      const indexProduct = newProducts.findIndex(
        item => item.id === product.id,
      );

      if (indexProduct === -1) {
        newProducts.push({ ...product, quantity: 1 });
      } else {
        newProducts[indexProduct].quantity += 1;
      }

      AsyncStorage.setItem(storageName, JSON.stringify(newProducts));
      AsyncStorage.setItem(storageName, JSON.stringify(newProducts));
      AsyncStorage.setItem(storageName, JSON.stringify(newProducts));

      setProducts(newProducts);
    },
    [products],
  );

  const increment = useCallback(
    id => {
      const newProducts = [...products];
      const indexProduct = newProducts.findIndex(product => product.id === id);

      if (indexProduct === -1) {
        return;
      }

      newProducts[indexProduct].quantity += 1;

      AsyncStorage.setItem(storageName, JSON.stringify(newProducts));
      setProducts(newProducts);
    },
    [products],
  );

  const decrement = useCallback(
    id => {
      const newProducts = [...products];
      const indexProduct = newProducts.findIndex(product => product.id === id);

      if (indexProduct === -1) {
        return;
      }

      if (newProducts[indexProduct].quantity > 1) {
        newProducts[indexProduct].quantity -= 1;
      } else {
        newProducts.splice(indexProduct, 1);
      }

      AsyncStorage.setItem(storageName, JSON.stringify(newProducts));
      setProducts(newProducts);
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
