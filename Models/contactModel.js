const { v4: uuidv4 } = require('uuid');  // Import the uuid package

class ContactSchema {
  constructor(userId, name, email, phone, liked) {
    this.setUser_id = userId;
    this.contact_id = uuidv4(); // Generate a unique ID for each contact
    this.setName = name;  // Use setter for validation
    this.setEmail = email;  // Use setter for validation
    this.setPhone = phone;  // Use setter for validation
    this.setLiked = liked;
    this.createdAt = new Date();
    this.updatedAt = this.createdAt; // Initially set to createdAt
  }

  //set user id
  set setUser_id(userId){
    if(typeof userId === "string"){
      this.userId = userId;
    }
  }

  set setLiked(liked){
    if(typeof liked === "boolean"){
      this.liked = liked;
    } else {
      throw new Error("Liked must be a boolean")
    }
  }

  // Setters with validation
  set setName(name) {
    if (typeof name === "string" && name.trim().length > 0) {
      this.name = name;
      this.updatedAt = new Date(); // Update timestamp when modified
    } else {
      throw new Error("Please specify a valid name");
    }
  }

  set setEmail(email) {
    if (typeof email === "string" && email.includes("@") || email.length === 0) {
      this.email = email;
      this.updatedAt = new Date(); // Update timestamp when modified
    } else {
      throw new Error("Please specify a valid email address");
    }
  }

  set setPhone(phone) {
    if (typeof phone === "string" && phone.trim().length > 0) {
      this.phone = phone;
      this.updatedAt = new Date(); // Update timestamp when modified
    } else {
      throw new Error("Phone number is required");
    }
  }

  // Method to display contact information
  getDetails() {
    return {
      userId: this.userId,
      contact_id: this.contact_id, 
      name: this.name,
      email: this.email,
      phone: this.phone,
      liked: this.liked,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = ContactSchema;
