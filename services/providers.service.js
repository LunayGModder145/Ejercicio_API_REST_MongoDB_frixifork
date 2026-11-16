const Provider = require('../models/provider.model');
const Product = require('../models/products.model');

const getAllProviders = async () => {
    return await Provider.find({}, '-__v');
};

const createProvider = async (providerData) => {
    const provider = new Provider(providerData);
    return await provider.save();
};

const updateProvider = async (company_name, updateData) => {
    return await Provider.findOneAndUpdate(
        { company_name },
        updateData,
        { new: true, runValidators: true }
    );
};

const deleteProvider = async (company_name) => {
    // 1. Buscar el proveedor por nombre
    const provider = await Provider.findOne({ company_name });
    if (!provider) {
        return { error: 'NOT_FOUND' };
    }

    // 2. Comprobar si tiene productos asociados (integridad referencial)
    const associatedProducts = await Product.countDocuments({ provider: provider._id });
    if (associatedProducts > 0) {
        return { error: 'HAS_PRODUCTS', count: associatedProducts };
    }

    // 3. Si no tiene productos, eliminar
    await Provider.deleteOne({ _id: provider._id });
    return { deleted: provider };
};

module.exports = {
    getAllProviders,
    createProvider,
    updateProvider,
    deleteProvider
};