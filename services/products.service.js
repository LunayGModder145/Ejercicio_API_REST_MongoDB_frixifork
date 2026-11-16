const Product = require('../models/products.model');
const Provider = require('../models/provider.model');
const mongoose = require('mongoose');

const getAllProducts = async () => {
    // .populate() trae los datos del proveedor asociado en lugar de solo su ObjectId
    return await Product.find({}, '-__v').populate('provider', '-__v');
};

const createProduct = async (productData) => {
    const { title, price, description, provider } = productData;

    // 1. Buscar primero el proveedor para obtener su _id
    let providerDoc = null;
    if (mongoose.Types.ObjectId.isValid(provider)) {
        providerDoc = await Provider.findById(provider);
    } else if (typeof provider === 'string') {
        providerDoc = await Provider.findOne({ company_name: provider });
    }

    if (!providerDoc) {
        return { error: 'PROVIDER_NOT_FOUND' };
    }

    // 2. Crear el producto enlazando el _id del proveedor
    const newProduct = new Product({
        title,
        price,
        description,
        provider: providerDoc._id
    });

    const savedProduct = await newProduct.save();
    return { product: await savedProduct.populate('provider', '-__v') };
};

const updateProduct = async (title, updateData) => {
    // Si en la actualización también viene un nombre de proveedor, resolvemos su _id
    if (updateData.provider && !mongoose.Types.ObjectId.isValid(updateData.provider)) {
        const providerDoc = await Provider.findOne({ company_name: updateData.provider });
        if (!providerDoc) {
            return { error: 'PROVIDER_NOT_FOUND' };
        }
        updateData.provider = providerDoc._id;
    }

    const updated = await Product.findOneAndUpdate(
        { title },
        updateData,
        { new: true, runValidators: true }
    ).populate('provider', '-__v');

    return { product: updated };
};

const deleteProduct = async (title) => {
    return await Product.findOneAndDelete({ title });
};

module.exports = {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
};