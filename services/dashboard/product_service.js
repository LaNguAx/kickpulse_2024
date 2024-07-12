import { ProductsModel } from '../../models/dashboard/product.js';

const getProducts = async () => {
  try {
    return await ProductsModel.find();
  } catch (err) {
    console.error('Error retrieving products:', err);
    throw new Error('Failed to retrieve products');
  }
};

const getProduct = async (id) => {
  try {
    const product = await ProductsModel.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  } catch (err) {
    console.error(`Error finding product with ID ${id}:`, err);
    throw new Error('Failed to retrieve product');
  }
};

const createProduct = async (product) => {
  try {
    const newProduct = new ProductsModel({
      name: product.name,
      sizes: product.sizes,
      price: product.price,
      quantity: product.quantity,
      description: product.description,
      supplier: { name: product.supplier.name, id: product.supplier.id },
      image: product.image,
      brand: { name: product.brand.name, id: product.brand.id },
      category: { name: product.category.name, id: product.category.id },
      gender: product.gender,
    });

    return await newProduct.save();
  } catch (err) {
    console.error('Error saving product:', err);
    throw new Error('Failed to save product');
  }
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(id);
    if (!deletedProduct) throw new Error('Product not found');
    return deletedProduct;
  } catch (err) {
    console.error(`Error deleting product with ID ${id}:`, err);
    throw new Error('Failed to delete product');
  }
};

const deleteProductsBySupplierId = async (supplierId) => {
  try {
    const result = await ProductsModel.deleteMany({
      'supplier.id': supplierId,
    });
    /*if (result.deletedCount === 0)
      throw new Error('No products found for supplier');
    */
    return result;
  } catch (err) {
    console.error(
      `Error deleting products for supplier ID ${supplierId}:`,
      err
    );
    throw new Error('Failed to delete products by supplier ID');
  }
};

const editProduct = async (id, options) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(id, options, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) throw new Error('Product not found');
    return updatedProduct;
  } catch (err) {
    console.error(`Error editing product with ID ${id}:`, err);
    throw new Error('Failed to edit product');
  }
};

export default {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  deleteProductsBySupplierId,
  editProduct,
};
