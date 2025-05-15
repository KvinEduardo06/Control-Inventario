import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useLogin } from './LoginProvider';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useLogin();
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  // PROVIDER
  const loginContext = useLogin();
  console.log("Contexto de Login:", loginContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      setLoading(true);
      try {
        console.log('Iniciando sesión con usuario:', { username, password });

        // Llamada a la API
        const response = await fetch('http://172.16.20.149:4000/api/public/usuario/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: username, // Usar directamente el nombre de usuario
            clave: password
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al iniciar sesión');
        }

        // Crear un email ficticio para mantener compatibilidad con el contexto existente
        const mockEmail = `${username}@domain.com`;

        // Si la respuesta es exitosa, continuamos con el login del contexto
        const success = login(mockEmail, password);

        if (success) {
          // Guardar token de la API si viene en la respuesta
          if (data.token) {
            localStorage.setItem('apiToken', data.token);
          }

          // Guardar también el nombre de usuario real
          localStorage.setItem('username', username);

          Swal.fire({
            title: `¡Bienvenido!`,
            text: 'Has iniciado sesión correctamente.',
            icon: 'success',
            confirmButtonText: 'Continuar'
          });

          navigate('/ComoInventario');
        }
      } catch (error) {
        console.error("Error en la autenticación:", error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudo iniciar sesión. Verifica tus credenciales.',
          icon: 'error',
          confirmButtonText: 'Intentar de nuevo'
        });
      } finally {
        setLoading(false);
      }
    }

    setValidated(true);
  };

  const handleGoogleLogin = async () => {
    if (loadingGoogle) return;
    setLoadingGoogle(true);

    try {
      // Usar la función loginWithGoogle del contexto
      const success = await loginWithGoogle();

      if (success) {
        navigate('/ComoInventario');
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <Container fluid className="vh-100 d-flex align-items-center justify-content-center bg-light">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5} xxl={4}>
          <Card className="border-0 shadow-lg">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-0 animate__animated animate__fadeInDown ">Bienvenido</h2>
                <p className="text-muted">Ingresa tus credenciales para continuar</p>
              </div>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-4" controlId="formUsername">
                  <Form.Label>Nombre de usuario</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light border-end-0">
                      <User size={18} className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="text"
                      placeholder="kevin.eduardo"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="bg-light border-start-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor ingresa tu nombre de usuario.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPassword">
                  <div className="d-flex justify-content-between">
                    <Form.Label>Contraseña</Form.Label>
                    <a href="#" className="text-decoration-none text-primary small">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light border-end-0">
                      <Lock size={18} className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-light border-start-0 border-end-0"
                      minLength={8}
                    />
                    <InputGroup.Text
                      className="bg-light border-start-0 cursor-pointer"
                      onClick={togglePasswordVisibility}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ?
                        <EyeOff size={18} className="text-primary" /> :
                        <Eye size={18} className="text-primary" />
                      }
                    </InputGroup.Text>
                    <Form.Control.Feedback type="invalid">
                      La contraseña debe tener al menos 8 caracteres.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="rememberMe"
                    label="Mantener sesión iniciada"
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="py-3 fw-bold"
                    disabled={loading}
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                  </Button>

                  {/* <div className="d-grid mt-3">
                    <Button
                      variant="danger"
                      size="lg"
                      onClick={handleGoogleLogin}
                      className="py-3"
                      disabled={loadingGoogle}
                    >
                      <i className="bi bi-google me-2"></i>
                      {loadingGoogle ? "Cargando..." : "Iniciar sesión con Google"}
                    </Button>
                  </div> */}
                </div>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0">
                  ¿No tienes una cuenta? <Link to="/registro" className="text-primary fw-bold">Regístrate</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;