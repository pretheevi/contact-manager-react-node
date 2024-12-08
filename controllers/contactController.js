const fs = require('fs');
const path = require('path');
const asyncHandler = require("express-async-handler");
const ContactSchema = require("../Models/contactModel");

const contacts_database_path = path.join(__dirname, '../Database/contact.json');

function getContactData(){
  const Data = JSON.parse(fs.readFileSync(contacts_database_path, 'utf8'));
  return Data;
};

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res, next) => {
  try{
    const getAllContact = await getContactData();
    const findLoggedUser = await getAllContact.filter( user => user.userId === req.user.id);
    if(!findLoggedUser){
      res.status(404);
      throw new Error(`cannot get contacts for user ${req.user.id}`);
    }
    res.status(200).json({data:findLoggedUser});
  }catch(error){
    res.status(500);
    return next(error);
  }
});

//@desc Create New Contacts
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res, next) => {
  const { name, email, phone, liked } = req.body;
  
  try {
    //get contact data
    const getALlData = await getContactData();

    if(!name || !phone) {
      res.status(404);
      throw new Error("Please enter Name and Phone number")
    }

    if(!req.user.id){
      res.status(404);
      return next("user not authenticated")
    }

    //check if contact already exists, if exists, return error message.
    const findContact = getALlData.find(contact => {
      if(contact.userId === req.user.id && contact.phone === phone){
        return contact
      }});
    if(findContact){
      res.status(400);
      return next(new Error("contact already exists"));
    }

    const user_id = req.user.id;

    // Create new contact using the ContactSchema class
    const contacts = new ContactSchema(user_id, name, email, phone, liked);

    //save the newly created contact in to th database
    getALlData.push(contacts.getDetails());
    fs.writeFileSync(contacts_database_path, JSON.stringify(getALlData, null, 2));

    // Send response with the created contact
    res.status(201).json({
      message: "Contact added to the list", 
      data: contacts.getDetails()  // Return the contact details in the response
    });
  } catch (error) {
    // Handle errors thrown by the ContactSchema class (e.g., invalid email or phone)
    res.status(400);
    return next(error);
  }
});


//@desc Get Contacts by ID
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res, next) => {
  try{
    const id = req.params.id;
    const getALlData = await getContactData();

    //Get contact by id, if  not found, return error message.
    const findContact = getALlData.find(contact => {
      if(contact.userId === req.user.id){
        return contact.contact_id === id
      }});
    if(!findContact){
        res.status(400);
        return next(new Error("contact not found"));
    }

    res.status(200).json({
      message:`contact found`,
      data:findContact
    });
  }catch(error){
    res.status(404)
    return next(error);
  }
});

//@desc Update Contacts by ID
//@route PUT /api/contacts/:id
//@access public
const updateContact = asyncHandler(async (req, res, next) => {
  try{
    const id = req.params.id;
    const { name, email, phone, liked } = req.body;
    const getALlData = await getContactData();

    //Get contact by id, if  not found, return error message.
    const index = getALlData.findIndex(contact => {
      if(contact.userId === req.user.id && contact.contact_id === id){
        return contact.contact_id === id;
      }});
      
    if(index === -1){
        res.status(400);
        return next(new Error("contact not found"));
    };

    // replace the data send by request in the found index.
    if (name) getALlData[index].name = name;
    if (email) getALlData[index].email = email;
    if (phone) getALlData[index].phone = phone;
    if(liked){
      getALlData[index].liked = liked;
    } 
    else if(!liked) {
      getALlData[index].liked = false;
    };

    //write the file to the database
    fs.writeFileSync(contacts_database_path, JSON.stringify(getALlData, null, 2));
    //send success response
    res.status(200).json({
      message:`updated Contact successfully`,
      data: getALlData[index] 
    });

  }catch(error){
    res.status(404)
    return next(error);
  }
});

//@desc DELE Contacts by ID
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res, next) => {
  try{
    const id = req.params.id;
    const getALlData = await getContactData();

    //Get contact by id, if  not found, return error message.
    const index = getALlData.findIndex(contact => contact.contact_id === id);
    if(index === -1){
        res.status(400);
        return next(new Error("contact not found"));
    };
    
    // Remove the contact from the array
    getALlData.splice(index, 1); // Removes the contact at the given index

    //write the file to the database
    fs.writeFileSync(contacts_database_path, JSON.stringify(getALlData, null, 2));
    //send success response
    res.status(200).json({
      message:`Deleted Contact successfully`
    });

  }catch(error){
    res.status(404)
    return next(error);
  }

});

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };