import SupplierService from '../../services/dashboard/supplier_service.js';

// restapi
export async function getSuppliers(req, res) {
  const suppliers = await SupplierService.getSuppliers();
  res.json(suppliers);
}
export async function createSupplier(req, res) {
  const supplier = { ...req.body };
  const newSupplier = await SupplierService.createSupplier(supplier);

  res.json(newSupplier);
}

export async function getSupplier(req, res) {
  const { id } = req.params;
  const supplier = await SupplierService.getSupplier(id);
  res.json(supplier);
}

export async function deleteSupplier(req, res) {
  const { id } = req.params;
  try {
    const deletedSupplier = await SupplierService.deleteSupplier(id);
    if (!deletedSupplier) throw 'error';
    
    // delete all related products to supplier
    const products = 

    
    res.json(deletedSupplier);



  } catch (err) {
    console.log(err);
  }
}
