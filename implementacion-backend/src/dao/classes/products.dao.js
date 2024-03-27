import { productsModel } from "../models/products.model.js";
import { logger } from "../../middlewares/logger/logger.middleware.js";

export default class Products {

    constructor() {
        this.logger = logger;
    }

    getProducts = async (query, options) => {
        try {
            let result = await productsModel.paginate(query, options);
            this.logger.info('Products successfully retrieved.');
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching products: ${error.message}`);
            return null;
        }
    }

    getProductsById = async (pid) => {
        try {
            let result = await productsModel.findById(pid);
            this.logger.info(`Product with ID ${pid} successfully retrieved.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while fetching product with ID ${pid}: ${error.message}`);
            return null;
        }
    }

    createProducts = async (title, description, price, thumbnail, code, stock, category) => {
        try {
            let result = await productsModel.create({
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category
            });
            this.logger.info(`Product "${title}" created successfully with id ${result._id}.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while creating product: ${error.message}`);
            return null;
        }
    }

    updateProducts = async ({ _id: pid }, productReplace) => {
        try {
            let result = await productsModel.updateOne({ _id: pid }, productReplace);
            this.logger.info(`Product with ID ${pid} updated successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while updating product with ID ${pid}: ${error.message}`);
            return null;
        }
    }

    deleteProducts = async ({ _id: pid }) => {
        try {
            let result = await productsModel.deleteOne({ _id: pid });
            this.logger.info(`Product with ID ${pid} deleted successfully.`);
            return result;
        } catch (error) {
            this.logger.error(`Error while deleting product with ID ${pid}: ${error.message}`);
            return null;
        }
    }
}
