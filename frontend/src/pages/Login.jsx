import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SafetyOutlined,
  LockOutlined,
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
  message,
  Checkbox
} from 'antd';
import axios from "axios";
import { toast } from 'react-hot-toast';

const { Title, Text } = Typography;

const Login = ({ setUser }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // 🔥 REAL BACKEND LOGIN
  const onFinish = async (values) => {
    setLoading(true);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/login",
        {
          email: values.email,
          password: values.password
        }
      );

      const { access_token, user } = response.data;

      // ✅ Store JWT token
      localStorage.setItem("token", access_token);

      // ✅ Store user info
      localStorage.setItem("user", JSON.stringify(user));

      // ✅ Update global state
      if (setUser) {
        setUser(user);
      }

      toast.success(`Welcome back, ${user.username}!`);
      message.success("Login successful!");

      navigate("/dashboard");

    } catch (error) {

      const errorMessage =
        error.response?.data?.detail || "Invalid email or password";

      toast.error(errorMessage);
      message.error(errorMessage);
    }

    setLoading(false);
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

      <Card
        style={{
          width: '100%',
          maxWidth: '450px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}
      >

        {/* Logo */}
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
        >

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Enter a valid email' }
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              style={{ borderRadius: '8px', height: '48px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              style={{ borderRadius: '8px', height: '48px' }}
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Checkbox>Remember me</Checkbox>
              <Button type="link" style={{ padding: 0 }}>
                Forgot password?
              </Button>
            </div>
          </Form.Item>

          {/* LOGIN BUTTON + REGISTER LINK */}
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

            {/* ✅ REGISTER BUTTON ADDED */}
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Button
                type="link"
                onClick={() => navigate("/register")}
              >
                Don't have an account? Register
              </Button>
            </div>

          </Form.Item>

        </Form>

      </Card>
    </div>
  );
};

export default Login;