import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, Form, Button, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate(); // <-- Este hook debe ir AQUÍ, dentro del componente

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      console.log('Iniciando sesión con:', { email, password });

      // ✅ Redirección
      navigate('/ComInventario');
    }

    setValidated(true);
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
                <Form.Group className="mb-4" controlId="formEmail">
                  <Form.Label>Correo electrónico</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light border-end-0">
                      <User size={18} className="text-primary" />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="email"
                      placeholder="nombre@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-light border-start-0"
                    />
                    <Form.Control.Feedback type="invalid">
                      Por favor ingresa un correo electrónico válido.
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
                  >
                    Iniciar sesión
                  </Button>

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