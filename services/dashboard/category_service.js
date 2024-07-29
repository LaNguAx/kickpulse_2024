import { CategoriesModel } from '../../models/dashboard/category.js';
import product_service from './product_service.js';

const getCategories = async () => {
  try {
    return await CategoriesModel.find();
  } catch (err) {
    console.error('Error retrieving categories:', err);
    throw new Error('Failed to retrieve categories');
  }
};

const getCategory = async (id) => {
  try {
    const specificCategory = await CategoriesModel.findById(id);
    if (specificCategory) return specificCategory;

    const allCategories = await getCategories();

    const subCategories = allCategories.map(
      (category) => category.subcategories
    );

    const category =
      specificCategory ||
      subCategories
        .map((subcategories) =>
          subcategories.find((subcat) => subcat._id == id)
        )
        .filter((el) => el != null);

    if (!category) throw new Error('Category not found');
    return category[0];
  } catch (err) {
    console.error(`Error finding category with ID ${id}:`, err);
    throw new Error('Failed to retrieve category');
  }
};

const createCategory = async (category) => {
  try {
    const newCategory = new CategoriesModel({
      name: category.name,
      subcategories: category.subcategories,
    });

    return await newCategory.save();
  } catch (err) {
    console.error('Error saving category:', err);
    throw new Error('Failed to save category');
  }
};

const updateCategory = async (id, category) => {
  try {
    // Find the category by ID and update it with the new data
    const updatedCategory = await CategoriesModel.findByIdAndUpdate(
      id,
      {
        name: category.name,
        subcategories: category.subcategories,
      },
      { new: true } // Return the updated document
    );

    // Check if the category was found and updated
    if (!updatedCategory) {
      throw new Error('Category not found');
    }

    return updatedCategory;
  } catch (err) {
    console.error('Error updating category:', err);
    throw new Error('Failed to update category');
  }
};

const getCategoryByName = async (name) => {
  try {

    const allCategories = await getCategories();

    // Find a specific category by name
    const specificCategory = allCategories.find(cat => cat.name.toLowerCase() === name);

    // Extract subcategories from all categories
    const subCategories = allCategories.map(category => category.subcategories).flat();

    // Find a specific subcategory by name
    const subCategory = subCategories.find(subcat => subcat.name.toLowerCase() === name);

    // Determine which category to return
    const category = specificCategory || subCategory;

    if (!category) throw new Error('Category not found');
    return category;
  } catch (err) {
    console.error(`Error finding category with name ${name}:`, err);
    throw new Error('Failed to retrieve category');
  }
};


const deleteCategory = async (id) => {
  try {

    const deletedCategory = await CategoriesModel.findByIdAndDelete(id);
    if (!deletedCategory) throw new Error('Category not found');
    return deletedCategory;
  } catch (err) {
    console.error(`Error deleting category with ID ${id}:`, err);
    throw new Error('Failed to delete category');
  }
};


const editCategory = async (id, options) => {
  try {
    const updatedCategory = await CategoriesModel.findByIdAndUpdate(
      id,
      options,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedCategory) throw new Error('Category not found');
    return updatedCategory;
  } catch (err) {
    console.error(`Error editing category with ID ${id}:`, err);
    throw new Error('Failed to edit category');
  }
};

export default {
  getCategories,
  getCategory,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
  editCategory,
};
