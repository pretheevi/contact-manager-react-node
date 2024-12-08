const { v4: uuidv4 } = require('uuid');

class UserSchema {
  constructor(name, email, password) {
    this.User_id = uuidv4();
    this.setName = name;  // Explicitly call the setter
    this.setEmail = email;  // Explicitly call the setter
    this.setPassword = password;  // Explicitly call the setter
    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
  }

  // Setters remain unchanged
  set setName(name) {
    if (typeof name === 'string' && name.trim().length >= 3) {
      this.name = name.trim();
      this.updatedAt = new Date();
    } else {
      throw new Error('Name must have at least 3 characters');
    }
  }

  set setEmail(email) {
    if (typeof email === 'string' && email.includes('@')) {
      this.email = email.trim();
      this.updatedAt = new Date();
    } else {
      throw new Error('Please enter a valid email');
    }
  }

  set setPassword(password) {
    if (typeof password === 'string' && password.length >= 8) {
      this.password = password;
      this.updatedAt = new Date();
    } else {
      throw new Error('Password must have at least 8 characters');
    }
  }

  getDetails() {
    return {
      User_id: this.User_id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}


module.exports = UserSchema;