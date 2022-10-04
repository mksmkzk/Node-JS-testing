

const getAllProductsStatic = async (req, res) => {
    throw new Error('Testing async errors');
    res.status(200).json({msg: 'Products testing route'});
}

const getAllProducts = async (req, res) => {
    // const products = await Product.find({});
    res.status(200).json({msg: 'Products route'});
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}