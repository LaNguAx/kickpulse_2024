import { SuppliersModel } from '../../models/dashboard/suppliers.js';
import ProductsService from '../../services/dashboard/product_service.js';

const getSuppliers = async () => {
  try {
    const suppliers = await SuppliersModel.find();
    return suppliers;
  } catch (err) {
    console.error('Error retrieving suppliers:', err);
    throw err;
  }
};

const getSupplier = async (id) => {
  try {
    const supplier = await SuppliersModel.findById(id);
    if (!supplier) throw 'Error finding supplier';

    return supplier;
  } catch (error) {
    console.log(`${error} on object ${id}`);
  }
};

const createSupplier = async (supplier) => {
  try {
    const newSupplier = new SuppliersModel({
      name: supplier.name,
      location: supplier.location,
      brands: supplier.brands,
    });

    const savedSupplier = await newSupplier.save();
    return savedSupplier;
  } catch (err) {
    console.error('Error saving supplier:', err);
  }
};

const deleteSupplier = async (id) => {
  try {
    const res = await SuppliersModel.findByIdAndDelete(id);
    if (!res) throw 'Failed deleting object';

    await ProductsService.deleteProductBySupplierId(id);

    return res;
  } catch (error) {
    console.log(error);
  }
};

const editSupplier = async (id, options) => {
  try {
    const res = await SuppliersModel.findByIdAndUpdate(id, options);
    if (!res) throw 'Failed deleting object';

    return res;
  } catch (error) {
    console.log(error);
  }
};

export default {
  getSuppliers,
  getSupplier,
  createSupplier,
  deleteSupplier,
  editSupplier,
};
