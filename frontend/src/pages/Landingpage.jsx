import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  SafetyOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  ArrowRightOutlined,
  BarChartOutlined,
  LockOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { Button, Typography, Space, Card, Row, Col, Divider } from 'antd';

const { Title, Text, Paragraph } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle login click
  const handleLoginClick = () => {
    navigate('/login');
  };

  // Handle dashboard click
  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #f5f3ff 100%)'
    }}>
      {/* Navigation */}
      <nav style={{ 
        background: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
        top: 0
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Logo */}
          <Space 
            size="middle" 
            style={{ cursor: 'pointer' }}
            onClick={() => scrollToSection('hero')}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <SafetyOutlined style={{ fontSize: '24px', color: '#fff' }} />
            </div>
            <Title level={3} style={{ 
              margin: 0,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Bias Guard AI
            </Title>
          </Space>
          
          {/* Navigation Links */}
          <Space size="large" style={{ display: 'flex', alignItems: 'center' }}>
            <Button 
              type="text" 
              onClick={() => scrollToSection('features')}
            >
              Features
            </Button>
            <Button 
              type="text" 
              onClick={() => scrollToSection('stats')}
            >
              Stats
            </Button>
            <Button 
              type="text" 
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </Button>
            
            <Divider type="vertical" style={{ height: '30px' }} />
            
            {/* Login Button - Redirects to Login Page */}
            <Button 
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              onClick={handleLoginClick}
              style={{
                background: 'transparent',
                border: '2px solid #667eea',
                color: '#667eea',
                fontWeight: '600'
              }}
            >
              Login
            </Button>
            
            {/* Dashboard Button */}
            <Button 
              type="primary" 
              size="large"
              icon={<RocketOutlined />}
              onClick={handleDashboardClick}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                fontWeight: '600'
              }}
            >
              Dashboard
            </Button>
          </Space>
        </div>
      </nav>

      {/* Hero Section */}
      <div id="hero" style={{ 
        paddingTop: '120px',
        paddingBottom: '80px',
        paddingLeft: '24px',
        paddingRight: '24px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} md={12}>
              <div>
                <Title level={1} style={{ 
                  fontSize: '52px',
                  fontWeight: '800',
                  marginBottom: '24px',
                  lineHeight: 1.2
                }}>
                  Ethical AI for{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Healthcare
                  </span>
                </Title>
                
                <Paragraph style={{ 
                  fontSize: '18px', 
                  color: '#4b5563',
                  marginBottom: '32px',
                  lineHeight: 1.8
                }}>
                  Generate synthetic patient data, train fair AI models, and monitor bias in real-time. 
                  Your complete solution for trustworthy healthcare AI that protects patient privacy 
                  and ensures equitable outcomes.
                </Paragraph>

                <Space size="middle">
                  {/* Get Started Button - Goes to Dashboard */}
                  <Button 
                    type="primary" 
                    size="large"
                    icon={<RocketOutlined />}
                    onClick={handleDashboardClick}
                    style={{
                      height: '52px',
                      padding: '0 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Get Started <ArrowRightOutlined />
                  </Button>
                  
                  {/* Login Button - Goes to Login Page */}
                  <Button 
                    size="large"
                    icon={<LoginOutlined />}
                    onClick={handleLoginClick}
                    style={{
                      height: '52px',
                      padding: '0 32px',
                      fontSize: '16px',
                      fontWeight: '600',
                      border: '2px solid #667eea',
                      color: '#667eea',
                      background: 'white'
                    }}
                  >
                    Login
                  </Button>
                </Space>

                {/* Trust badges */}
                <Space style={{ marginTop: '40px' }}>
                  <CheckCircleOutlined style={{ color: '#10b981' }} />
                  <Text type="secondary">HIPAA Compliant</Text>
                  <CheckCircleOutlined style={{ color: '#10b981', marginLeft: '20px' }} />
                  <Text type="secondary">GDPR Ready</Text>
                  <CheckCircleOutlined style={{ color: '#10b981', marginLeft: '20px' }} />
                  <Text type="secondary">FDA Registered</Text>
                </Space>
              </div>
            </Col>
            
            <Col xs={24} md={12}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '32px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transform: 'perspective(1000px) rotateY(-5deg)',
                transition: 'transform 0.3s',
                ':hover': {
                  transform: 'perspective(1000px) rotateY(0deg)'
                }
              }}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card 
                      bordered={false} 
                      style={{ 
                        textAlign: 'center',
                        background: '#f8fafc',
                        borderRadius: '16px'
                      }}
                      hoverable
                    >
                      <SafetyOutlined style={{ fontSize: '40px', color: '#667eea' }} />
                      <Title level={4} style={{ marginTop: '16px', marginBottom: 0 }}>Fairness First</Title>
                      <Text type="secondary">Demographic parity</Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card 
                      bordered={false} 
                      style={{ 
                        textAlign: 'center',
                        background: '#f8fafc',
                        borderRadius: '16px'
                      }}
                      hoverable
                    >
                      <DatabaseOutlined style={{ fontSize: '40px', color: '#764ba2' }} />
                      <Title level={4} style={{ marginTop: '16px', marginBottom: 0 }}>Synthetic Data</Title>
                      <Text type="secondary">Privacy-safe generation</Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card 
                      bordered={false} 
                      style={{ 
                        textAlign: 'center',
                        background: '#f8fafc',
                        borderRadius: '16px'
                      }}
                      hoverable
                    >
                      <BarChartOutlined style={{ fontSize: '40px', color: '#10b981' }} />
                      <Title level={4} style={{ marginTop: '16px', marginBottom: 0 }}>Real-time Monitor</Title>
                      <Text type="secondary">Continuous auditing</Text>
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card 
                      bordered={false} 
                      style={{ 
                        textAlign: 'center',
                        background: '#f8fafc',
                        borderRadius: '16px'
                      }}
                      hoverable
                    >
                      <LockOutlined style={{ fontSize: '40px', color: '#f59e0b' }} />
                      <Title level={4} style={{ marginTop: '16px', marginBottom: 0 }}>Privacy Safe</Title>
                      <Text type="secondary">Differential privacy</Text>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" style={{ 
        padding: '80px 24px',
        background: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <Badge style={{ marginBottom: '16px' }}>
              <Text type="secondary" style={{ fontSize: '16px', letterSpacing: '2px' }}>FEATURES</Text>
            </Badge>
            <Title level={2} style={{ 
              fontSize: '36px',
              fontWeight: '700',
              marginBottom: '16px'
            }}>
              Why Choose{' '}
              <span style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Bias Guard AI
              </span>
            </Title>
            <Text type="secondary" style={{ fontSize: '18px' }}>
              Comprehensive solution for ethical AI in healthcare
            </Text>
          </div>

          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card 
                hoverable
                style={{ 
                  height: '100%',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(102, 126, 234, 0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <DatabaseOutlined style={{ fontSize: '40px', color: '#667eea' }} />
                </div>
                <Title level={4}>Synthetic Data Generation</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  Create privacy-safe, balanced healthcare data using GANs and VAEs
                </Text>
                <Button type="link" onClick={handleLoginClick}>Learn more →</Button>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card 
                hoverable
                style={{ 
                  height: '100%',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(118, 75, 162, 0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <DashboardOutlined style={{ fontSize: '40px', color: '#764ba2' }} />
                </div>
                <Title level={4}>Real-time Monitoring</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  Continuous bias detection and algorithmic drift monitoring
                </Text>
                <Button type="link" onClick={handleLoginClick}>Learn more →</Button>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card 
                hoverable
                style={{ 
                  height: '100%',
                  borderRadius: '16px',
                  textAlign: 'center',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <ExperimentOutlined style={{ fontSize: '40px', color: '#10b981' }} />
                </div>
                <Title level={4}>Fair Model Training</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: '16px' }}>
                  Train AI models on balanced datasets with fairness constraints
                </Text>
                <Button type="link" onClick={handleLoginClick}>Learn more →</Button>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Stats Section */}
      <div id="stats" style={{ 
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 48]} justify="center">
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Title level={1} style={{ color: 'white', margin: 0, fontSize: '48px' }}>10K+</Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
                Patients Protected
              </Text>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Title level={1} style={{ color: 'white', margin: 0, fontSize: '48px' }}>50+</Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
                Healthcare Models
              </Text>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Title level={1} style={{ color: 'white', margin: 0, fontSize: '48px' }}>99.9%</Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
                Privacy Guarantee
              </Text>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: 'center' }}>
              <Title level={1} style={{ color: 'white', margin: 0, fontSize: '48px' }}>24/7</Title>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
                Real-time Monitoring
              </Text>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        padding: '80px 24px',
        background: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Title level={2} style={{ marginBottom: '24px', fontSize: '36px' }}>
            Ready to ensure fairness in your AI models?
          </Title>
          <Paragraph style={{ 
            fontSize: '18px', 
            color: '#4b5563',
            marginBottom: '32px',
            lineHeight: 1.8
          }}>
            Join leading healthcare institutions that trust Bias Guard AI for ethical and fair AI deployment.
          </Paragraph>
          
          <Space size="middle">
            <Button 
              type="primary" 
              size="large"
              icon={<RocketOutlined />}
              onClick={handleDashboardClick}
              style={{
                height: '52px',
                padding: '0 40px',
                fontSize: '16px',
                fontWeight: '600',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
            >
              Start Free Trial
            </Button>
            
            <Button 
              size="large"
              icon={<LoginOutlined />}
              onClick={handleLoginClick}
              style={{
                height: '52px',
                padding: '0 40px',
                fontSize: '16px',
                fontWeight: '600',
                border: '2px solid #667eea',
                color: '#667eea',
                background: 'white'
              }}
            >
              Login
            </Button>
          </Space>
        </div>
      </div>

      {/* Footer */}
      <div id="contact" style={{ 
        padding: '60px 24px 30px',
        background: '#1f2937',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[48, 48]}>
            <Col xs={24} md={8}>
              <Space direction="vertical" size="middle">
                <Space>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <SafetyOutlined style={{ fontSize: '24px', color: '#fff' }} />
                  </div>
                  <Title level={4} style={{ color: 'white', margin: 0 }}>Bias Guard AI</Title>
                </Space>
                <Text style={{ color: '#9ca3af', lineHeight: 1.8 }}>
                  Ensuring fairness and ethics in healthcare AI through continuous monitoring and synthetic data generation.
                </Text>
                <Space size="middle">
                  <Button type="text" icon={<GithubOutlined />} style={{ color: '#9ca3af' }} />
                  <Button type="text" icon={<TwitterOutlined />} style={{ color: '#9ca3af' }} />
                  <Button type="text" icon={<LinkedinOutlined />} style={{ color: '#9ca3af' }} />
                </Space>
              </Space>
            </Col>
            
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>Quick Links</Title>
              <Space direction="vertical" size="middle">
                <Button type="link" onClick={() => scrollToSection('features')} style={{ color: '#9ca3af', padding: 0 }}>Features</Button>
                <Button type="link" onClick={() => scrollToSection('stats')} style={{ color: '#9ca3af', padding: 0 }}>Stats</Button>
                <Button type="link" onClick={handleLoginClick} style={{ color: '#9ca3af', padding: 0 }}>Login</Button>
                <Button type="link" onClick={handleDashboardClick} style={{ color: '#9ca3af', padding: 0 }}>Dashboard</Button>
              </Space>
            </Col>
            
            <Col xs={24} md={8}>
              <Title level={4} style={{ color: 'white', marginBottom: '24px' }}>Contact Us</Title>
              <Space direction="vertical" size="middle">
                <Space>
                  <MailOutlined style={{ color: '#667eea' }} />
                  <Text style={{ color: '#9ca3af' }}>info@biasguard.ai</Text>
                </Space>
                <Space>
                  <PhoneOutlined style={{ color: '#667eea' }} />
                  <Text style={{ color: '#9ca3af' }}>+1 (555) 123-4567</Text>
                </Space>
                <Space>
                  <EnvironmentOutlined style={{ color: '#667eea' }} />
                  <Text style={{ color: '#9ca3af' }}>San Francisco, CA</Text>
                </Space>
              </Space>
            </Col>
          </Row>
          
          <Divider style={{ borderColor: '#374151', margin: '40px 0 20px' }} />
          
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#9ca3af'
          }}>
            <Text style={{ color: '#9ca3af' }}>
              © 2024 Bias Guard AI. All rights reserved.
            </Text>
            <Space size="middle">
              <Button type="link" style={{ color: '#9ca3af', padding: 0 }}>Privacy Policy</Button>
              <Button type="link" style={{ color: '#9ca3af', padding: 0 }}>Terms of Service</Button>
              <Button type="link" style={{ color: '#9ca3af', padding: 0 }}>Cookie Policy</Button>
            </Space>
          </div>
        </div>
      </div>
    </div>
  );
};

// Badge component helper
const Badge = ({ children, style }) => (
  <div style={{
    display: 'inline-block',
    padding: '4px 12px',
    background: 'rgba(102, 126, 234, 0.1)',
    borderRadius: '20px',
    ...style
  }}>
    {children}
  </div>
);

export default LandingPage;