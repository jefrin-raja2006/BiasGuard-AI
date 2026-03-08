import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  DashboardOutlined,
  SafetyOutlined,
  WarningOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  AlertOutlined
} from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Space,
  Button,
  Progress,
  List,
  Avatar,
  Typography,
  Badge
} from 'antd';

const { Title } = Typography;

const Dashboard = () => {

  const [dashboardData, setDashboardData] = useState(null);

  // 🔥 Fetch Dashboard Data
  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:8000/api/dashboard/overview"
      );
      setDashboardData(res.data);
    } catch (error) {
      console.log("Dashboard fetch error", error);
    }
  };

  // 🔥 Auto load + auto refresh every 10 seconds
  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(fetchDashboard, 10000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      title: 'Model',
      dataIndex: 'name',
      key: 'name',
      render: (text) => (
        <Space>
          <ExperimentOutlined style={{ color: '#667eea' }} />
          <span style={{ fontWeight: 500 }}>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Fairness',
      dataIndex: 'fairness',
      key: 'fairness',
      render: (value) => (
        <Progress
          percent={value || 0}
          size="small"
          status={
            value >= 90
              ? 'success'
              : value >= 80
              ? 'normal'
              : 'exception'
          }
          strokeColor={
            value >= 90
              ? '#10b981'
              : value >= 80
              ? '#f59e0b'
              : '#ef4444'
          }
        />
      ),
    },
    {
      title: 'Accuracy',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (value) => <Tag color="blue">{value}%</Tag>,
    },
    {
      title: 'Drift',
      dataIndex: 'drift',
      key: 'drift',
      render: (value) => (
        <Tag color={value > 20 ? 'red' : value > 15 ? 'orange' : 'green'}>
          {value}%
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'success';
        if (status === 'warning') color = 'warning';
        if (status === 'critical') color = 'error';
        return <Badge status={color} text={status} />;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: () => <Button type="link">View Details</Button>,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <DashboardOutlined style={{ marginRight: 12 }} />
        Dashboard Overview
      </Title>

      {/* 🔥 TOP METRICS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>

        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff'
            }}
          >
            <Statistic
              title={<span style={{ color: '#fff' }}>Fairness Score</span>}
              value={dashboardData?.fairness_score || 0}
              suffix="%"
              precision={2}
              valueStyle={{ color: '#fff' }}
              prefix={<SafetyOutlined />}
            />
            <Progress
              percent={dashboardData?.fairness_score || 0}
              showInfo={false}
              strokeColor="#fff"
              trailColor="rgba(255,255,255,0.3)"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Active Alerts"
              value={dashboardData?.active_alerts || 0}
              valueStyle={{ color: '#ef4444' }}
              prefix={<WarningOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Deployed Models"
              value={dashboardData?.deployed_models || 0}
              valueStyle={{ color: '#10b981' }}
              prefix={<ExperimentOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Synthetic Datasets"
              value={dashboardData?.synthetic_datasets || 0}
              valueStyle={{ color: '#8b5cf6' }}
              prefix={<DatabaseOutlined />}
            />
          </Card>
        </Col>

      </Row>

      {/* 🔥 TABLE + ALERTS */}
      <Row gutter={[16, 16]}>

        <Col xs={24} lg={16}>
          <Card title="Model Performance Overview" bordered={false}>
            <Table
              columns={columns}
              dataSource={dashboardData?.models || []}
              pagination={false}
              rowKey="name"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Recent Alerts" bordered={false}>
            <List
              dataSource={dashboardData?.alerts || []}
              renderItem={(item, index) => (
                <List.Item key={index}>
                  <List.Item.Meta
                    avatar={<Avatar icon={<AlertOutlined />} />}
                    title={item.message}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

      </Row>
    </div>
  );
};

export default Dashboard;