import ProductService from '../../services/dashboard/product_service.js';

// Get all products
export async function getProducts(req, res) {
  try {
    const products = await ProductService.getProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Create a new product
export async function createProduct(req, res) {
  try {
    const product = { ...req.body };
    const newProduct = await ProductService.createProduct(product);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get a single product by ID
export async function getProduct(req, res) {
  const { id } = req.params;
  try {
    const product = await ProductService.getProduct(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Delete a product by ID
export async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const deletedProduct = await ProductService.deleteProduct(id);
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: 'Product not found' });
    }
    res.status(200).json({ success: true, data: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get Products By Gender
export async function getProductsByGender(req, res) {
  const { gender } = req.params;

  try {

    // Fetch products based on the filter
    const products = await ProductService.getProductsByGender(gender);
    if (!products) {
      return res.status(404).json({ success: false, message: `No products by gender ${gender} found.` });
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products by gender:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }



}
