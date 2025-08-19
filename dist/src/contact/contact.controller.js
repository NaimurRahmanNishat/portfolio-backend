"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContact = void 0;
const contact_model_1 = __importDefault(require("./contact.model"));
const ResponseHandler_1 = require("../utils/ResponseHandler");
const createContact = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name?.trim() || name.length < 3) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, 'Name must be at least 3 characters');
        }
        if (!email || !/.+@.+\..+/.test(email)) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, 'Please enter a valid email address');
        }
        if (!message?.trim() || message.length < 10) {
            return (0, ResponseHandler_1.errorResponse)(res, 400, 'Message must be at least 10 characters');
        }
        const contact = new contact_model_1.default({ name, email, message });
        await contact.save();
        return (0, ResponseHandler_1.successResponse)(res, 201, "Contact created successfully", contact);
    }
    catch (error) {
        return (0, ResponseHandler_1.errorResponse)(res, 500, "Failed to create contact");
    }
};
exports.createContact = createContact;
