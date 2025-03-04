import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextInput,
  Container,
  Card,
  Title,
  Center,
  Space
} from '@mantine/core';
import { useLoginMutation } from '../services/authApi';

const LoginPage = () => {
  const [emailId, setEmailId] = useState('Vidya@gmail.com');
  const [password, setPassword] = useState('Vidya@123');
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { loading, error } = useSelector((state) => state.auth);
  const [loginUser, { isLoading, error }] = useLoginMutation();

  const handleLogin = async () => {
    try {
      await loginUser({ emailId, password }).unwrap();
      navigate('/dashboard'); // Redirect to Dashboard after login
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <Container>
      <Center>
        <Card
          shadow="sm"
          padding="lg"
          style={{ marginTop: '30px', width: 400 }}
        >
          <Title>Login</Title>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
          />
          <Space h="md" />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={handleLogin} loading={isLoading} fullWidth mt="md">
            Login
          </Button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Card>
      </Center>
    </Container>
  );
};

export default LoginPage;
