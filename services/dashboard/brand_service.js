import { BrandsModel } from '../../models/dashboard/brand.js';

const getBrands = async () => {
  try {
    return await BrandsModel.find();
  } catch (err) {
    console.error('Error retrieving brands:', err);
    throw new Error('Failed to retrieve brands');
  }
};

const getBrand = async (id) => {
  try {
    const brand = await BrandsModel.findById(id);
    if (!brand) throw new Error('Brand not found');
    return brand;
  } catch (err) {
    console.error(`Error finding brand with ID ${id}:`, err);
    throw new Error('Failed to retrieve brand');
  }
};

const createBrand = async (brand) => {
  try {
    const newBrand = new BrandsModel({
      name: brand.name,
    });

    return await newBrand.save();
  } catch (err) {
    console.error('Error saving brand:', err);
    throw new Error('Failed to save brand');
  }
};

const deleteBrand = async (id) => {
  try {
    const deletedBrand = await BrandsModel.findByIdAndDelete(id);
    if (!deletedBrand) throw new Error('Brand not found');
    return deletedBrand;
  } catch (err) {
    console.error(`Error deleting brand with ID ${id}:`, err);
    throw new Error('Failed to delete brand');
  }
};

const updateBrand = async (id, options) => {
  try {
    const updatedBrand = await BrandsModel.findByIdAndUpdate(id, options, {
      new: true,
      runValidators: true,
    });
    if (!updatedBrand) throw new Error('Brand not found');
    return updatedBrand;
  } catch (err) {
    console.error(`Error editing brand with ID ${id}:`, err);
    throw new Error('Failed to edit brand');
  }
};

export default {
  getBrands,
  getBrand,
  createBrand,
  deleteBrand,
  updateBrand,
};
