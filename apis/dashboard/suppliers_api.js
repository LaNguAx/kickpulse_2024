import SupplierService from '../../services/dashboard/supplier_service.js';
import ProductsService from '../../services/dashboard/product_service.js';

// Get all suppliers
export async function getSuppliers(req, res) {
  try {
    const suppliers = await SupplierService.getSuppliers();
    res.status(200).json({ success: true, data: suppliers });
  } catch (err) {
    console.error('Error fetching suppliers:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Create a new supplier
export async function createSupplier(req, res) {
  try {
    const supplier = { ...req.body };
    const newSupplier = await SupplierService.createSupplier(supplier);
    res.status(201).json({ success: true, data: newSupplier });
  } catch (err) {
    console.error('Error creating supplier:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get a single supplier by ID
export async function getSupplier(req, res) {
  const { id } = req.params;
  try {
    const supplier = await SupplierService.getSupplier(id);
    if (!supplier) {
      return res
        .status(404)
        .json({ success: false, message: 'Supplier not found' });
    }
    res.status(200).json({ success: true, data: supplier });
  } catch (err) {
    console.error('Error fetching supplier:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Delete a supplier by ID
export async function deleteSupplier(req, res) {
  const { id } = req.params;
  try {
    const deletedSupplier = await SupplierService.deleteSupplier(id);
    if (!deletedSupplier) {
      return res
        .status(404)
        .json({ success: false, message: 'Supplier not found' });
    }

    // Delete all related products to supplier
    await ProductsService.deleteProductsBySupplierId(id);

    res.status(200).json({ success: true, data: deletedSupplier });
  } catch (err) {
    console.error('Error deleting supplier:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get Suppliers Brands

export async function getSupplierBrands(req, res) {
  const { id } = req.params;
  try {
    const supplierBrands = await SupplierService.getSupplierBrands(id);
    if (supplierBrands.length == 0) {
      return res
        .status(404)
        .json({ success: false, message: `Supplier doesn't have brands` });
    }
    res.status(200).json({ success: true, data: supplierBrands });
  } catch (error) {
    console.error(`Error getting supplier's brands:`, error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

