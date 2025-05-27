import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextInput,
  Container,
  Card,
  Title,
  Center,
  Space,
  Group
} from '@mantine/core';
import { useLoginMutation, useSignupMutation } from '../services/authApi';

const LoginPage = () => {
  const [emailId, setEmailId] = useState('Vidya@gmail.com');
  const [password, setPassword] = useState('Vidya@123');
  const [name, setName] = useState('');
  const [isSignupMode, setIsSignupMode] = useState(false);

  const navigate = useNavigate();

  const [loginUser, { isLoading: isLoggingIn, error: loginError }] =
    useLoginMutation();
  const [signUp, { isLoading: isSigningUp, error: signupError }] =
    useSignupMutation();

  const handleAuth = async () => {
    try {
      if (isSignupMode) {
        await signUp({ name, emailId, password }).unwrap();
      } else {
        await loginUser({ emailId, password }).unwrap();
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Auth failed:', err);
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
          <Title>{isSignupMode ? 'Sign Up' : 'Login'}</Title>

          {isSignupMode && (
            <>
              <TextInput
                label="Name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                mt="md"
              />
              <Space h="md" />
            </>
          )}

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

          <Button
            onClick={handleAuth}
            loading={isSignupMode ? isSigningUp : isLoggingIn}
            fullWidth
            mt="md"
          >
            {isSignupMode ? 'Sign Up' : 'Login'}
          </Button>

          {(loginError || signupError) && (
            <p style={{ color: 'red', marginTop: '10px' }}>
              {loginError?.data?.message ||
                signupError?.data?.message ||
                'Something went wrong'}
            </p>
          )}

          <Group position="center" mt="md" style={{ cursor: 'pointer' }}>
            <Button
              component="button"
              variant="subtle"
              onClick={() => setIsSignupMode(!isSignupMode)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isSignupMode
                ? 'Already have an account? Log in'
                : "Don't have an account? Sign up"}
            </Button>
          </Group>
        </Card>
      </Center>
    </Container>
  );
};

export default LoginPage;
