import { SuppliersModel } from '../../models/dashboard/suppliers.js';

const getSuppliers = async () => {
  try {
    return await SuppliersModel.find();
  } catch (err) {
    console.error('Error retrieving suppliers:', err);
    throw new Error('Failed to retrieve suppliers');
  }
};

const getSupplier = async (id) => {
  try {
    const supplier = await SuppliersModel.findById(id);
    if (!supplier) throw new Error('Supplier not found');
    return supplier;
  } catch (err) {
    console.error(`Error finding supplier with ID ${id}:`, err);
    throw new Error('Failed to retrieve supplier');
  }
};

const createSupplier = async (supplier) => {
  try {
    const newSupplier = new SuppliersModel({
      name: supplier.name,
      location: supplier.location,
      brands: supplier.brands,
    });
    return await newSupplier.save();
  } catch (err) {
    console.error('Error saving supplier:', err);
    throw new Error('Failed to save supplier');
  }
};

const deleteSupplier = async (id) => {
  try {
    const deletedSupplier = await SuppliersModel.findByIdAndDelete(id);
    if (!deletedSupplier) throw new Error('Supplier not found');
    return deletedSupplier;
  } catch (err) {
    console.error(`Error deleting supplier with ID ${id}:`, err);
    throw new Error('Failed to delete supplier');
  }
};

const editSupplier = async (id, options) => {
  try {
    const updatedSupplier = await SuppliersModel.findByIdAndUpdate(
      id,
      options,
      { new: true, runValidators: true }
    );
    if (!updatedSupplier) throw new Error('Supplier not found');
    return updatedSupplier;
  } catch (err) {
    console.error(`Error editing supplier with ID ${id}:`, err);
    throw new Error('Failed to edit supplier');
  }
};

const getSupplierBrands = async (id) => {
  try {
    const supplier = await getSupplier(id);
    const brands = supplier.brands;
    return brands;
  } catch (err) {
    console.log(
      `Error getting supplier's brands for supplier ID ${id} error code: `,
      err
    );
    throw new Error('Failed getting supplier brands!');
  }
};

export default {
  getSuppliers,
  getSupplier,
  createSupplier,
  deleteSupplier,
  editSupplier,
  getSupplierBrands,
};
