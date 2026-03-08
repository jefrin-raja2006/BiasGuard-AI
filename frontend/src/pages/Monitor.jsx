import React, { useState, useEffect } from 'react';
import {
  DashboardOutlined,
  WarningOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  LineChartOutlined,
  TeamOutlined,
  ExperimentOutlined,
  AlertOutlined
} from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Statistic,
  Tag,
  Space,
  Progress,
  Alert,
  List,
  Typography,
  Tooltip
} from 'antd';

const { Title, Text } = Typography;

const Monitor = () => {

  const [dashboardData, setDashboardData] = useState(null);
  const [fairnessHistory, setFairnessHistory] = useState([]);

  // 🔥 Real-time polling every 5 seconds
  useEffect(() => {

    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/monitor-dashboard");
        const data = await res.json();

        console.log("Monitor API:", data);

        if (!data.error) {
          setDashboardData(data);

          // Keep last 12 fairness values
          setFairnessHistory(prev => {
            const updated = [...prev, data.overall_fairness];
            return updated.slice(-12);
          });
        }

      } catch (err) {
        console.log("Monitor fetch error");
      }
    };

    fetchDashboard();
    const interval = setInterval(fetchDashboard, 5000);

    return () => clearInterval(interval);

  }, []);

  // If no data yet
  if (!dashboardData) {
    return <div style={{ padding: 24 }}>Loading Monitor...</div>;
  }

  const getStatusColor = (status) => {
    if (status === 'good') return '#10b981';
    if (status === 'warning') return '#f59e0b';
    if (status === 'critical') return '#ef4444';
    return '#6b7280';
  };

  return (
    <div style={{ padding: 24 }}>

      <Title level={2}>
        <DashboardOutlined /> Real-time Bias Monitor
      </Title>

      {/* SUMMARY CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>

        <Col span={6}>
          <Card>
            <Statistic
              title="Overall Fairness"
              value={dashboardData.overall_fairness || 0}
              suffix="%"
              valueStyle={{
                color: dashboardData.overall_fairness >= 80 ? '#10b981' : '#ef4444'
              }}
              prefix={<SafetyOutlined />}
            />
            <Progress
              percent={dashboardData.overall_fairness || 0}
              showInfo={false}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Drift Score"
              value={dashboardData.drift_score || 0}
              precision={3}
              prefix={<ExperimentOutlined />}
            />
            <Text type="secondary">Threshold: 0.20</Text>
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Active Alerts"
              value={dashboardData.alerts?.length || 0}
              prefix={<AlertOutlined />}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card>
            <Statistic
              title="Last Update"
              value="Live"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>

      </Row>

      {/* FAIRNESS TREND */}
      <Card
        title={<><LineChartOutlined /> Fairness Trend</>}
        style={{ marginBottom: 24 }}
      >
        <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          {fairnessHistory.map((value, index) => (
            <Tooltip key={index} title={`${value}%`}>
              <div style={{
                flex: 1,
                height: `${value * 2}px`,
                background:
                  value >= 85 ? '#10b981' :
                  value >= 75 ? '#f59e0b' :
                  '#ef4444',
                borderRadius: 4,
                transition: 'all 0.3s'
              }} />
            </Tooltip>
          ))}
        </div>
      </Card>

      {/* PROTECTED GROUP ANALYSIS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>

        <Col span={12}>
          <Card title={<><TeamOutlined /> Protected Group Analysis</>}>
            <List
              dataSource={dashboardData.protected_analysis || []}
              renderItem={(item) => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}>
                      <Space>
                        <Text strong>{item.group}</Text>
                        <Tag color={
                          item.status === 'good' ? 'green' :
                          item.status === 'warning' ? 'orange' : 'red'
                        }>
                          {item.status.toUpperCase()}
                        </Tag>
                      </Space>
                      <Text style={{ color: getStatusColor(item.status) }}>
                        {(100 - (item.bias * 100)).toFixed(1)}%
                      </Text>
                    </div>
                    <Progress
                      percent={(100 - (item.bias * 100))}
                      showInfo={false}
                      strokeColor={getStatusColor(item.status)}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* ALERTS */}
        <Col span={12}>
          <Card title={<><WarningOutlined /> Active Alerts</>}>
            {dashboardData.alerts?.length > 0 ? (
              dashboardData.alerts.map((alert, index) => (
                <Alert
                  key={index}
                  message={alert.message}
                  type={alert.type}
                  showIcon
                  style={{ marginBottom: 10 }}
                />
              ))
            ) : (
              <Text type="secondary">No active alerts</Text>
            )}
          </Card>
        </Col>

      </Row>

    </div>
  );
};

export default Monitor;