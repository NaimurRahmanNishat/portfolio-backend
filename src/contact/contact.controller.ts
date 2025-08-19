import { Request, Response } from "express";
import Contacts from "./contact.model";
import { errorResponse, successResponse } from "../utils/ResponseHandler";

const createContact = async (req:Request, res: Response) => {
    try {
        const { name, email, message } = req.body;
        if(!name?.trim() || name.length < 3){
            return errorResponse(res, 400, 'Name must be at least 3 characters');
        }
        if(!email || !/.+@.+\..+/.test(email)){
            return errorResponse(res, 400, 'Please enter a valid email address');
        }
        if (!message?.trim() || message.length < 10) {
            return errorResponse(res, 400, 'Message must be at least 10 characters');
        }
        const contact = new Contacts({ name, email, message });
        await contact.save();
        return successResponse(res, 201, "Contact created successfully", contact);
    } catch (error) {
        return errorResponse(res, 500, "Failed to create contact");
    }
};

export { createContact };