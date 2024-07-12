import BrandService from '../../services/dashboard/brand_service.js';
import ProductsService from '../../services/dashboard/product_service.js';

// Get all brands
export async function getBrands(req, res) {
  try {
    const brands = await BrandService.getBrands();
    res.status(200).json({ success: true, data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Create a new brand
export async function createBrand(req, res) {
  try {
    const brand = { ...req.body };

    const newBrand = await BrandService.createBrand(brand);
    res.status(201).json({ success: true, data: newBrand });
  } catch (error) {
    console.error('Error creating brand:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Get a single brand by ID
export async function getBrand(req, res) {
  const { id } = req.params;
  try {
    const brand = await BrandService.getBrand(id);
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: 'Brand not found' });
    }
    res.status(200).json({ success: true, data: brand });
  } catch (error) {
    console.error('Error fetching brand:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}

// Delete a brand by ID
export async function deleteBrand(req, res) {
  const { id } = req.params;
  try {
    const deletedBrand = await BrandService.deleteBrand(id);
    if (!deletedBrand) {
      return res
        .status(404)
        .json({ success: false, message: 'Brand not found' });
    }

    // delete all products related to a specific Brand
    await ProductsService.deleteProductsByBrandId(id);

    res.status(200).json({ success: true, data: deletedBrand });
  } catch (error) {
    console.error('Error deleting brand:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}
