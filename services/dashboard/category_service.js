import { CategoriesModel } from '../../models/dashboard/category.js';

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
    const allCategories = await CategoriesModel.find({});

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
    return category;
  } catch (err) {
    console.error(`Error finding category with ID ${id}:`, err);
    throw new Error('Failed to retrieve category');
  }
};

const createCategory = async (category) => {
  try {
    // console.log(category)
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
  createCategory,
  deleteCategory,
  editCategory,
};
