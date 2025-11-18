import { useState, useCallback } from 'react';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import './App.css';

/**
 * Main App component that integrates ProductList and ProductForm.
 * Manages the product list state and refreshes it when new products are created.
 */
function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductCreated = useCallback(() => {
    // Trigger a refresh of the ProductList by incrementing the key
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Product Management</h1>
      </header>
      <main>
        <ProductForm onProductCreated={handleProductCreated} />
        <ProductList key={refreshKey} />
      </main>
    </div>
  );
}

export default App;
