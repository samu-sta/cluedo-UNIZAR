/**
 * @fileoverview Hook personalizado para gestionar la lógica de la página de registro
 * @author Samuel Felipe
 */
import { useState } from 'react';
import { userSchema } from '../../../../schemas/schemas';
import { useNavigate } from 'react-router-dom';

const useRegisterPage = (registerUserFn) => {

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {

    setErrors({});
    e.preventDefault()

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const validationResult = userSchema.validateRegisterUser(data);

    if (!validationResult.success) {
      setErrors(validationResult.error.formErrors.fieldErrors);
      return;
    }
    const { confirmPassword: _confirmPassword, ...rest } = data;
    try {
      const response = await registerUserFn(rest);

      if (response.error) {
        setErrors({ email: response.error });
        return;
      }
      setErrors({});
      navigate('/login');
    }
    catch (error) {
      console.error('Error en el servidor: ' + (error?.message || 'Unknown error'));
      setErrors({ server: 'Error en el servidor, por favor intente más tarde.' });
    }
  }

  return {
    errors,
    handleSubmit
  }
}

export default useRegisterPage;