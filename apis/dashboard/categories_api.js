import CategoryService from "../../services/dashboard/category_service.js";
import ProductsService from "../../services/dashboard/product_service.js";

// Get all categories
export async function getCategories(req, res) {
  try {
    const categories = await CategoryService.getCategories();
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Create a new category
export async function createCategory(req, res) {
  try {
    const category = { ...req.body };

    const newCategory = await CategoryService.createCategory(category);
    res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Get a single category by ID
export async function getCategory(req, res) {
  const { id } = req.params;
  try {
    const category = await CategoryService.getCategory(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Update a category by ID
export async function updateCategory(req, res) {
  const { id } = req.params;
  const newCategory = { ...req.body };

  // calculate the diffence between old vs new to delete any subcategories that have been deleted by user & delete the products associated with the delete subcategories
  const oldCategory = await CategoryService.getCategory(id);
  oldCategory.subcategories.forEach(async (subcat) => {
    // this means that the user deleted a subcategory
    if (!newCategory.subcategories.find((cat) => cat._id == subcat._id)) {
      await ProductsService.deleteProductsByCategoryId(subcat._id);
    }
  });

  try {
    const category = await CategoryService.updateCategory(id, newCategory);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // update related products category name // CONTINUE HERE TMRW
    // category.id = category._id;
    // category.subcategories.forEach(subcat => subcat.id = subcat._id);
    await ProductsService.updateProductsCategoryName(category);

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Get all category's product
export async function getCategoryProducts(req, res) {
  const { id } = req.params;

  try {
    const products = await ProductsService.getProductsByCategoryId(id);

    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

// Delete a category by ID
export async function deleteCategory(req, res) {
  const { id } = req.params;
  try {
    const deletedCategory = await CategoryService.deleteCategory(id);
    if (!deletedCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    // delete all products related to a specific Category
    await ProductsService.deleteProductsByCategoryId(id);

    res.status(200).json({ success: true, data: deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}
