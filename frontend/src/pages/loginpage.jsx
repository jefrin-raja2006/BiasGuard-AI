import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SafetyOutlined,
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  MailOutlined
} from '@ant-design/icons';
import {
  Card,
  Input,
  Button,
  Form,
  Typography,
  Space,
  Divider,
  message,
  Checkbox,
  Alert
} from 'antd';
import { toast } from 'react-hot-toast';

const { Title, Text } = Typography;

// Hardcoded credentials for testing
const VALID_CREDENTIALS = [
  {
    email: 'admin@biasguard.ai',
    password: 'admin123',
    role: 'Admin',
    name: 'Admin User'
  },
  {
    email: 'doctor@hospital.com',
    password: 'doctor123',
    role: 'Doctor',
    name: 'Dr. Sarah Johnson'
  },
  {
    email: 'researcher@lab.com',
    password: 'research123',
    role: 'Researcher',
    name: 'Prof. Michael Chen'
  },
  {
    email: 'demo@biasguard.ai',
    password: 'demo123',
    role: 'Demo User',
    name: 'Demo Account'
  }
];

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Demo credentials for quick login
  const demoCredentials = [
    { label: 'Admin', email: 'admin@biasguard.ai', password: 'admin123' },
    { label: 'Doctor', email: 'doctor@hospital.com', password: 'doctor123' },
    { label: 'Researcher', email: 'researcher@lab.com', password: 'research123' },
    { label: 'Demo', email: 'demo@biasguard.ai', password: 'demo123' },
  ];

  const onFinish = (values) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Check credentials
      const user = VALID_CREDENTIALS.find(
        cred => cred.email === values.email && cred.password === values.password
      );

      if (user) {
        // Store user info in localStorage
        localStorage.setItem('user', JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role
        }));
        
        // Update the user state in App
        if (setUser) {
          setUser({
            name: user.name,
            email: user.email,
            role: user.role
          });
        }
        
        toast.success(`Welcome back, ${user.name}!`);
        message.success('Login successful!');
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
        message.error('Invalid credentials!');
      }
      
      setLoading(false);
    }, 1000);
  };

  const fillDemoCredentials = (email, password) => {
    form.setFieldsValue({
      email: email,
      password: password
    });
    toast.success(`Credentials filled for ${email}`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0
      }}>
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(60px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(60px)'
        }} />
      </div>

      {/* Login Card */}
      <Card
        style={{
          width: '100%',
          maxWidth: '450px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Logo and Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <SafetyOutlined style={{ fontSize: '40px', color: '#fff' }} />
          </div>
          <Title level={2} style={{ 
            margin: 0,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Bias Guard AI
          </Title>
          <Text type="secondary">Login to access your dashboard</Text>
        </div>

        {/* Login Form */}
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          initialValues={{
            remember: true
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Email"
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Password"
              style={{ borderRadius: '8px', height: '48px' }}
              iconRender={(visible) => visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Button type="link" style={{ padding: 0 }}>
                Forgot password?
              </Button>
            </div>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px'
              }}
            >
              Log In
            </Button>
          </Form.Item>
        </Form>

        {/* Demo Credentials */}
        <div style={{ marginTop: '24px' }}>
          <Divider>Demo Credentials</Divider>
          <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '16px' }}>
            Click on any card to auto-fill credentials
          </Text>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {demoCredentials.map((cred, index) => (
              <Card 
                key={index}
                size="small"
                hoverable
                style={{ 
                  cursor: 'pointer',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  transition: 'all 0.3s'
                }}
                bodyStyle={{ padding: '12px' }}
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Space>
                    <UserOutlined style={{ color: '#667eea' }} />
                    <Text strong>{cred.label}</Text>
                  </Space>
                  <Text type="secondary" style={{ fontSize: '12px' }}>Click to fill</Text>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                    Email: {cred.email}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                    Password: {cred.password}
                  </Text>
                </div>
              </Card>
            ))}
          </Space>
        </div>

        {/* Social Login Options */}
        <Divider>Or continue with</Divider>
        
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button 
            icon={<GoogleOutlined />} 
            block
            style={{ 
              height: '44px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e5e7eb'
            }}
          >
            Sign in with Google
          </Button>
          
          <Button 
            icon={<GithubOutlined />} 
            block
            style={{ 
              height: '44px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #e5e7eb'
            }}
          >
            Sign in with GitHub
          </Button>
        </Space>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Text type="secondary">Don't have an account? </Text>
          <Button type="link" style={{ padding: '0 4px' }}>
            Sign up
          </Button>
        </div>

        {/* Terms */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            By logging in, you agree to our{' '}
            <Button type="link" style={{ padding: 0, fontSize: '12px' }}>Terms</Button>
            {' and '}
            <Button type="link" style={{ padding: 0, fontSize: '12px' }}>Privacy Policy</Button>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;