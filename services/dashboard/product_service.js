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
      category: {
        name: product.category.name,
        id: product.category.id,
        subcategories: product.category.subcategories,
      },
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

const deleteProductsByBrandId = async (brandId) => {
  try {
    const result = await ProductsModel.deleteMany({
      'brand.id': brandId,
    });
    /*if (result.deletedCount === 0)
      throw new Error('No products found for supplier');
    */
    return result;
  } catch (err) {
    console.error(`Error deleting products for brand ID ${brandId}:`, err);
    throw new Error('Failed to delete products by brand ID');
  }
};

const deleteProductsByCategoryId = async (categoryId) => {
  try {
    const products = await getProductsByCategoryId(categoryId);
    const productIds = products.map(product => product._id);
    const result = await ProductsModel.deleteMany({ _id: { $in: productIds } })

    /*
    if (result.deletedCount === 0)
      throw new Error('No products found for category');
    */
    return result;
  } catch (err) {
    console.error(`Error deleting products for category ID ${categoryId}:`, err);
    throw new Error('Failed to delete products by category ID');
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

const getProductsByCategoryId = async (id) => {
  try {
    const filteredProducts = await ProductsModel.find({
      $or: [
        { 'category.id': id },
        { 'category.subcategories.id': id }
      ]
    });

    return filteredProducts;
  } catch (e) {
    f
    console.error(`Error getting product with category id ${id}:`, e);
    throw new Error('Failed to get product by category ID');
  }
};


const updateProductsBrandName = async (brandId, newName) => {
  try {
    await ProductsModel.updateMany(
      { 'brand.id': brandId }, // Find documents where brand.id matches brandId
      { $set: { 'brand.name': newName } } // Update the brand.name field to newName
      , { new: true });

    // console.log(`Updated brand name for products with brand ID ${brandId} to '${newName}'.`);

  } catch (e) {
    console.error('Error updating brand name for products:', e);
    throw new Error('Failed updating brand name for products!');
  }
};

const updateProductsCategoryName = async (category) => {
  try {
    // Update products that only have the category without subcategories
    await ProductsModel.updateMany(
      { 'category.id': category.id, 'category.subcategories': { $size: 0 } },
      {
        $set: {
          'category.name': category.name
        }
      }
    );

    // Update products that have subcategories
    for (let subcategory of category.subcategories) {
      await ProductsModel.updateMany(
        { 'category.id': category.id, 'category.subcategories.id': subcategory.id },
        {
          $set: {
            'category.name': category.name,
            'category.subcategories.$[elem].name': subcategory.name
          }
        },
        {
          arrayFilters: [{ 'elem.id': subcategory.id }]
        }
      );
    }

    // console.log(`Updated products for category ID ${category.id}.`);
  } catch (e) {
    console.error('Error updating category name for products:', e);
    throw new Error('Failed updating category name for products!');
  }
};

export default {
  getProducts,
  getProduct,
  getProductsByCategoryId,
  createProduct,
  deleteProduct,
  deleteProductsBySupplierId,
  deleteProductsByBrandId,
  deleteProductsByCategoryId,
  editProduct,
  updateProductsBrandName,
  updateProductsCategoryName,
};
