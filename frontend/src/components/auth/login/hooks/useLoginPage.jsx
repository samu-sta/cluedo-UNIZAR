import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSchema } from '../../../../schemas/schemas';
import { loginUser } from '../../../../services/User';

const useLoginPage = (setUser) => {
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

      navigate('/');
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