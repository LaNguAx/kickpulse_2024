import SupplierService from '../../services/dashboard/supplier_service.js';
import BrandService from '../../services/dashboard/brand_service.js';
export async function suppliersIndex(req, res) {
  const allSuppliers = await SupplierService.getSuppliers();
  const allBrands = await BrandService.getBrands();
  res.render('../views/dashboard/suppliers', {
    suppliers: allSuppliers,
    brands: allBrands,
  });
}
