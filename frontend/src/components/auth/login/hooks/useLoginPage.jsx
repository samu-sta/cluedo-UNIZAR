/**
 * @fileoverview Hook personalizado para gestionar la lógica de la página de inicio de sesión
 * @author Samuel Felipe
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSchema } from '../../../../schemas/schemas';
import { ROUTES } from '../../../../utils/constants';

const useLoginPage = (setUser, loginUser) => {
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors({});
    setIsLoading(true);
    setServerError(null);

    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const validationResult = userSchema.validateLoginUser(data);

      if (!validationResult.success) {
        setErrors(validationResult.error.formErrors.fieldErrors);
        return;
      }
      const response = await loginUser(data);

      if (response.error) {
        setServerError(response.error);
        return
      }
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));

      navigate(ROUTES.GAMES);
    }
    catch (error) {
      setServerError('Error en el servidor, por favor intente más tarde.');
    }
    finally {
      setIsLoading(false);
    }
  };

  return {
    errors,
    isLoading,
    handleSubmit,
    serverError
  };
};

export default useLoginPage;