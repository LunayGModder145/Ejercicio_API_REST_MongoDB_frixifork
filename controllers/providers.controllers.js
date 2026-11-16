const providersService = require('../services/providers.service');

const getProviders = async (req, res) => {
    try {
        const providers = await providersService.getAllProviders();
        res.status(200).json(providers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProvider = async (req, res) => {
    try {
        const newProvider = await providersService.createProvider(req.body);
        res.status(201).json({
            message: 'proveedor creado',
            provider: newProvider
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateProvider = async (req, res) => {
    try {
        // Permite buscar por company_name actual o filtro enviado en el body
        const filterName = req.body.company_name;
        if (!filterName) {
            return res.status(400).json({ message: 'Debes indicar el company_name del proveedor a editar' });
        }

        const updated = await providersService.updateProvider(filterName, req.body);
        if (!updated) {
            return res.status(404).json({ message: `Proveedor no encontrado: ${filterName}` });
        }

        res.status(200).json({
            message: `proveedor actualizado: ${updated.company_name}`,
            provider: updated
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteProvider = async (req, res) => {
    try {
        // Acepta company_name o title en el body según el enunciado
        const nameToDelete = req.body.company_name || req.body.title;
        if (!nameToDelete) {
            return res.status(400).json({ message: 'Debes indicar el nombre del proveedor a borrar' });
        }

        const result = await providersService.deleteProvider(nameToDelete);

        if (result.error === 'NOT_FOUND') {
            return res.status(404).json({ message: `No se encontró el proveedor: ${nameToDelete}` });
        }

        if (result.error === 'HAS_PRODUCTS') {
            return res.status(409).json({
                message: `No se puede borrar el proveedor '${nameToDelete}' porque tiene ${result.count} producto(s) asociado(s). Borra o reasigna sus productos primero.`
            });
        }

        res.status(200).json({
            message: `Se ha borrado el proveedor: ${nameToDelete}`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProviders,
    createProvider,
    updateProvider,
    deleteProvider
};