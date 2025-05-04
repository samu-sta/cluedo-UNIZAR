/*************************************************
 * Test del esquema de usuario
 * 
 * Este test verifica la validación de esquemas para
 * operaciones relacionadas con usuarios, incluyendo
 * registro e inicio de sesión.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { describe, expect, it } from '@jest/globals';
import userSchema from '../../../src/schemas/UserSchema.js';

describe('UserSchema', () => {
  describe('validateRegisterUser', () => {
    it('should validate a valid user registration with all fields', () => {
      const validData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const result = userSchema.validateRegisterUser(validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });
    
    // Actualizando este test ya que ahora el email es obligatorio
    it('should reject a user registration without email', () => {
      const invalidData = {
        username: 'testuser',
        password: 'password123'
      };
      
      const result = userSchema.validateRegisterUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject registration with too short username', () => {
      const invalidData = {
        username: 'ab', // Too short (less than 3 characters)
        email: 'test@example.com',
        password: 'password123'
      };
      
      const result = userSchema.validateRegisterUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject registration with too short password', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
        password: '12345' // Too short (less than 6 characters)
      };
      
      const result = userSchema.validateRegisterUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject registration with invalid email format', () => {
      const invalidData = {
        username: 'testuser',
        email: 'not-an-email', // Invalid email format
        password: 'password123'
      };
      
      const result = userSchema.validateRegisterUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject registration with missing username', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const result = userSchema.validateRegisterUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject registration with missing password', () => {
      const invalidData = {
        username: 'testuser',
        email: 'test@example.com',
      };
      
      const result = userSchema.validateRegisterUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('validateLoginUser', () => {
    // Actualizando este test ya que ahora se requiere el email
    it('should reject login with only username', () => {
      const invalidData = {
        username: 'testuser',
        password: 'password123'
      };
      
      const result = userSchema.validateLoginUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should validate login with email', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const result = userSchema.validateLoginUser(validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });
    
    // Actualizando este test para verificar que el username se ignora
    it('should ignore username when both username and email are provided', () => {
      const inputData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const expectedData = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const result = userSchema.validateLoginUser(inputData);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(expectedData);
    });
    
    it('should reject login with missing username and email', () => {
      const invalidData = {
        password: 'password123'
      };
      
      const result = userSchema.validateLoginUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject login with too short password', () => {
      const invalidData = {
        username: 'testuser',
        password: '12345' // Too short (less than 6 characters)
      };
      
      const result = userSchema.validateLoginUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject login with missing password', () => {
      const invalidData = {
        username: 'testuser'
      };
      
      const result = userSchema.validateLoginUser(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
  
  describe('validateChangePassword', () => {
    it('should validate matching passwords', () => {
      const validData = {
        newPassword: 'newpassword123',
        newPasswordConfirmation: 'newpassword123'
      };
      
      const result = userSchema.validateChangePassword(validData);
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });
    
    it('should reject with non-matching passwords', () => {
      const invalidData = {
        newPassword: 'newpassword123',
        newPasswordConfirmation: 'differentpassword'
      };
      
      const result = userSchema.validateChangePassword(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject with too short password', () => {
      const invalidData = {
        newPassword: '12345', // Too short (less than 6 characters)
        newPasswordConfirmation: '12345'
      };
      
      const result = userSchema.validateChangePassword(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject with missing newPassword', () => {
      const invalidData = {
        newPasswordConfirmation: 'password123'
      };
      
      const result = userSchema.validateChangePassword(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    
    it('should reject with missing newPasswordConfirmation', () => {
      const invalidData = {
        newPassword: 'password123'
      };
      
      const result = userSchema.validateChangePassword(invalidData);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});