const productsService = require('../services/products.service');

const getProducts = async (req, res) => {
    try {
        const products = await productsService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const result = await productsService.createProduct(req.body);

        if (result.error === 'PROVIDER_NOT_FOUND') {
            return res.status(404).json({
                message: `No se encontró el proveedor indicado: '${req.body.provider}'. Créalo primero o revisa el nombre.`
            });
        }

        res.status(201).json({
            message: 'producto creado',
            product: result.product
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Debes indicar el title del producto a editar' });
        }

        const result = await productsService.updateProduct(title, req.body);

        if (result.error === 'PROVIDER_NOT_FOUND') {
            return res.status(404).json({
                message: `No se encontró el proveedor indicado: '${req.body.provider}'`
            });
        }

        if (!result.product) {
            return res.status(404).json({ message: `Producto no encontrado: ${title}` });
        }

        res.status(200).json({
            message: `producto actualizado: ${result.product.title}`,
            product: result.product
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Debes indicar el title del producto a borrar' });
        }

        const deleted = await productsService.deleteProduct(title);
        if (!deleted) {
            return res.status(404).json({ message: `Producto no encontrado: ${title}` });
        }

        res.status(200).json({
            message: `Se ha borrado el producto: ${title}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
};