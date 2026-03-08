import React, { useState, useEffect } from "react";
import { Layout, Menu, Button, theme, ConfigProvider, message, Avatar, Dropdown, Space, Badge } from "antd";
import {
  BarChartOutlined,
  FileTextOutlined,
  DashboardOutlined,
  MonitorOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SafetyOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  QuestionCircleOutlined,
  HomeOutlined,
  ExperimentOutlined
} from "@ant-design/icons";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate
} from "react-router-dom";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SynthesisGenerator from "./pages/SynthesisGenerator";
import DatasetUpload from "./pages/DatasetUpload";
import Monitor from "./pages/Monitor";
import BiasAnalysis from "./pages/BiasAnalysis";
import CompareData from "./pages/CompareData"; // ✅ ADDED Compare page

const { Header, Sider, Content } = Layout;

/* ===========================
   🔐 Protected Route
=========================== */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  /* ===========================
     Load user from localStorage
  =========================== */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Auth pages (no sidebar)
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  const getSelectedKey = () => {
    const path = location.pathname.split("/")[1];
    return path || "dashboard";
  };

  /* ===========================
     🚪 Logout
  =========================== */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    message.success("Logged out successfully");
    navigate("/login");
  };

  /* ===========================
     👤 User Dropdown Menu
  =========================== */
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: "help",
      icon: <QuestionCircleOutlined />,
      label: "Help & Support",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  /* ===========================
     🔔 Notification Items
  =========================== */
  const notificationItems = [
    {
      key: "1",
      label: (
        <Space>
          <Badge status="error" />
          <span>Bias detected in Cardiac model</span>
        </Space>
      ),
    },
    {
      key: "2",
      label: (
        <Space>
          <Badge status="success" />
          <span>Synthetic data generation complete</span>
        </Space>
      ),
    },
    {
      key: "3",
      label: (
        <Space>
          <Badge status="warning" />
          <span>Fairness score dropped to 85%</span>
        </Space>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "view-all",
      label: <Link to="/monitor">View All Alerts</Link>,
    },
  ];

  /* ===========================
     📋 Sidebar Menu
  =========================== */
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "upload",
      icon: <FileTextOutlined />,
      label: <Link to="/upload">Dataset Upload</Link>,
    },
    {
      key: "bias-analysis",
      icon: <SafetyOutlined />,
      label: <Link to="/bias-analysis">Bias Analysis</Link>,
    },
    {
      key: "synthesis",
      icon: <BarChartOutlined />,
      label: <Link to="/synthesis">Synthetic Generator</Link>,
    },
    {
      key: "monitor",
      icon: <MonitorOutlined />,
      label: <Link to="/monitor">Real-time Monitor</Link>,
    },
  ];

  /* ===========================
     AUTH PAGES (Landing / Login / Register)
  =========================== */
  if (isAuthPage) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Content>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Content>
      </Layout>
    );
  }

  /* ===========================
     MAIN DASHBOARD LAYOUT
  =========================== */
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        width={250} 
        theme="dark"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          overflow: 'auto',
          height: '100vh',
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontSize: collapsed ? '14px' : '18px',
          }}
          onClick={() => navigate("/dashboard")}
        >
          {!collapsed ? (
            <span>
              <SafetyOutlined style={{ marginRight: '8px' }} />
              Bias Guard AI
            </span>
          ) : (
            <SafetyOutlined style={{ fontSize: '24px' }} />
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          style={{ 
            background: '#0f172a',
            color: '#94a3b8',
          }}
        />
      </Sider>

      <Layout style={{ 
        marginLeft: collapsed ? 80 : 250,
        transition: 'all 0.2s',
        minHeight: '100vh',
      }}>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
            width: '100%',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px' }}
          />

          {user && (
            <Space size="middle">
              {/* Notifications */}
              <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight">
                <Badge count={notifications} size="small">
                  <Button 
                    type="text" 
                    icon={<BellOutlined style={{ fontSize: '18px' }} />}
                    style={{ position: 'relative', top: '2px' }}
                  />
                </Badge>
              </Dropdown>

              {/* User Profile */}
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar 
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                    icon={<UserOutlined />}
                  />
                  <span>{user?.username || user?.name || 'User'}</span>
                </Space>
              </Dropdown>

              {/* Home Button */}
              <Button 
                type="primary" 
                icon={<HomeOutlined />}
                onClick={() => navigate('/')}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                }}
              >
                Home
              </Button>
            </Space>
          )}
        </Header>

        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: "#fff",
          borderRadius: '12px',
          minHeight: '280px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <DatasetUpload />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bias-analysis"
              element={
                <ProtectedRoute>
                  <BiasAnalysis />
                </ProtectedRoute>
              }
            />

            <Route
              path="/synthesis"
              element={
                <ProtectedRoute>
                  <SynthesisGenerator />
                </ProtectedRoute>
              }
            />

            <Route
              path="/monitor"
              element={
                <ProtectedRoute>
                  <Monitor />
                </ProtectedRoute>
              }
            />

            {/* ✅ NEW: Compare Route */}
            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <CompareData />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

/* ===========================
   🚀 Theme Configuration
=========================== */
const themeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#667eea',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    borderRadius: 8,
  },
  components: {
    Button: {
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
    },
  },
};

/* ===========================
   🚀 APP ROOT
=========================== */
function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <Router>
        <AppContent />
      </Router>
    </ConfigProvider>
  );
}

export default App;