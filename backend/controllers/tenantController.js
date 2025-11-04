import Tenant from '../models/Tenant.js';

export const updateTenantSettings = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'User is not an admin' });
  }

  try {
    // --- 1. GET THE NEW 'settings' OBJECT FROM THE BODY ---
    const { storeName, primaryColor, logoUrl, settings } = req.body;
    
    const tenant = await Tenant.findById(req.tenant._id);

    if (tenant) {
      tenant.storeName = storeName || tenant.storeName;
      
      if (primaryColor) tenant.theme.primaryColor = primaryColor;
      if (logoUrl) tenant.theme.logoUrl = logoUrl;

      // --- 2. UPDATE THE SETTINGS ---
      if (settings) {
        if (settings.enable3dModel !== undefined) {
          tenant.settings.enable3dModel = settings.enable3dModel;
        }
        // You could add 'enableReviews' here too
      }

      const updatedTenant = await tenant.save();
      res.status(200).json(updatedTenant);
    } else {
      res.status(404).json({ message: 'Tenant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};