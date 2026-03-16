import React, { useState, useEffect } from 'react';
import {
  DashboardOutlined,
  WarningOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  BarChartOutlined,
  LineChartOutlined,
  TeamOutlined,
  ExperimentOutlined,
  AlertOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  CloudServerOutlined,
  UploadOutlined
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
  Select,
  Progress,
  Badge,
  Alert,
  List,
  Typography,
  Spin,
  Empty,
  message,
  Modal,
  Divider
} from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = 'http://localhost:8000';

const Monitor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Target column selection states
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [settingTarget, setSettingTarget] = useState(false);
  const [needsTarget, setNeedsTarget] = useState(false);

  // Fetch monitoring data from backend
  const fetchMonitorData = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    else setRefreshing(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/monitor-dashboard`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch monitoring data');
      }
      
      // Check if we need to select a target column
      if (data.needs_target) {
        setNeedsTarget(true);
        setError({
          type: 'needs_target',
          message: data.message || 'Please select a target column for bias analysis',
          suggestions: data.suggested_columns || []
        });
        // Automatically open modal when target is needed
        setShowTargetModal(true);
        fetchAvailableColumns();
        setMetrics(null);
      } else if (data.error) {
        if (data.status === 'no_data') {
          setError({
            type: 'no_data',
            message: 'No dataset uploaded. Please upload a dataset first.'
          });
        } else {
          setError({
            type: 'error',
            message: data.error
          });
        }
        setMetrics(null);
      } else {
        setMetrics(data);
        setLastUpdated(new Date().toLocaleTimeString());
        setError(null);
        setNeedsTarget(false);
      }
    } catch (err) {
      console.error('Error fetching monitor data:', err);
      setError({
        type: 'error',
        message: err.message
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch available columns for target selection
  const fetchAvailableColumns = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dataset-columns`);
      const data = await response.json();
      
      if (response.ok && data.columns) {
        setAvailableColumns(data.columns);
      }
    } catch (err) {
      console.error('Error fetching columns:', err);
      message.error('Failed to load columns');
    }
  };

  // Set target column
  const handleSetTarget = async () => {
    if (!selectedTarget) {
      message.error('Please select a target column');
      return;
    }

    setSettingTarget(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/set-target-column`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_column: selectedTarget })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to set target column');
      }

      message.success(`Target column set to '${selectedTarget}'`);
      setShowTargetModal(false);
      setSelectedTarget(null);
      setNeedsTarget(false);
      
      // Refresh monitor data
      fetchMonitorData();
      
    } catch (err) {
      console.error('Error setting target:', err);
      message.error(err.message);
    } finally {
      setSettingTarget(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchMonitorData();
  }, []);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchMonitorData(false);
  };

  // Go to upload page
  const goToUpload = () => {
    navigate('/upload');
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '100px',
        minHeight: '500px'
      }}>
        <Spin size="large" />
        <p style={{ marginTop: '20px', color: '#666' }}>
          Loading monitoring data...
        </p>
      </div>
    );
  }

  // Error state with different types
  if (error) {
    if (error.type === 'no_data') {
      return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <CloudServerOutlined style={{ fontSize: '64px', color: '#ef4444', marginBottom: '20px' }} />
          <Title level={3}>No Dataset Uploaded</Title>
          <Alert
            message={error.message}
            type="warning"
            showIcon
            style={{ maxWidth: '600px', margin: '20px auto' }}
          />
          <Button 
            type="primary" 
            icon={<UploadOutlined />} 
            onClick={goToUpload}
            size="large"
            style={{ marginTop: '20px' }}
          >
            Go to Upload Page
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            style={{ marginTop: '20px', marginLeft: '10px' }}
          >
            Retry
          </Button>
        </div>
      );
    }

    // This will show the target selection UI
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <DashboardOutlined style={{ fontSize: '64px', color: '#f59e0b', marginBottom: '20px' }} />
        <Title level={3}>Target Column Required</Title>
        <Alert
          message={error.message || 'Please select a target column for bias analysis'}
          type="info"
          showIcon
          style={{ maxWidth: '600px', margin: '20px auto' }}
        />
        <Button 
          type="primary" 
          onClick={() => setShowTargetModal(true)}
          size="large"
          style={{ marginTop: '20px' }}
        >
          Select Target Column
        </Button>

        {/* Target Selection Modal */}
        <Modal
          title="Select Target Column for Bias Analysis"
          open={showTargetModal}
          onCancel={() => setShowTargetModal(false)}
          footer={[
            <Button key="cancel" onClick={() => setShowTargetModal(false)}>
              Cancel
            </Button>,
            <Button 
              key="submit" 
              type="primary" 
              onClick={handleSetTarget}
              loading={settingTarget}
            >
              Set Target Column
            </Button>,
          ]}
          width={600}
        >
          <p style={{ marginBottom: '16px' }}>
            Your dataset doesn't have an obvious binary column. Please select a column to use as the target variable for bias analysis:
          </p>
          
          <Select
            placeholder="Select a target column"
            style={{ width: '100%' }}
            size="large"
            onChange={(value) => setSelectedTarget(value)}
            value={selectedTarget}
            loading={availableColumns.length === 0}
          >
            {availableColumns.map(col => (
              <Option key={col.name} value={col.name}>
                <Space>
                  <span>{col.name}</span>
                  <Tag color={col.type === 'numerical' ? 'blue' : 'green'}>
                    {col.type} ({col.unique_values} values)
                  </Tag>
                </Space>
              </Option>
            ))}
          </Select>

          {error?.suggestions && error.suggestions.length > 0 && (
            <>
              <Divider>Suggested Columns</Divider>
              <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {error.suggestions.map(col => (
                  <Tag 
                    key={col.name}
                    color="processing" 
                    style={{ margin: '4px', padding: '8px 12px', cursor: 'pointer', fontSize: '14px' }}
                    onClick={() => setSelectedTarget(col.name)}
                  >
                    {col.name} ({col.unique_values} values)
                  </Tag>
                ))}
              </div>
            </>
          )}
        </Modal>
      </div>
    );
  }

  // No metrics state
  if (!metrics) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Empty description="No monitoring data available" />
        <Button type="primary" onClick={handleRefresh} style={{ marginTop: '20px' }}>
          Refresh
        </Button>
      </div>
    );
  }

  const protectedGroups = metrics.protected_analysis || [];
  const recentDrifts = metrics.recent_drifts || [];

  const columns = [
    {
      title: 'Protected Group',
      dataIndex: 'group',
      key: 'group',
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: 'Bias Score',
      dataIndex: 'bias',
      key: 'bias',
      render: (value) => {
        const percent = (value * 100).toFixed(1);
        return (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Progress 
              percent={100 - (value * 100)} 
              size="small"
              status={value > 0.15 ? 'exception' : value > 0.08 ? 'normal' : 'success'}
              strokeColor={value > 0.15 ? '#ef4444' : value > 0.08 ? '#f59e0b' : '#10b981'}
              format={() => `${percent}%`}
            />
          </Space>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color = status === 'good' ? 'success' : status === 'warning' ? 'warning' : 'error';
        return <Badge status={color} text={status.toUpperCase()} />;
      },
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header with Refresh */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <Title level={2} style={{ 
            marginBottom: '8px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            <DashboardOutlined style={{ marginRight: '12px' }} />
            Real-time Bias Monitor
          </Title>
          {lastUpdated && (
            <Text type="secondary">
              Last updated: {lastUpdated} • Dataset: {metrics.dataset} • Target: {metrics.target_column}
            </Text>
          )}
        </div>
        
        <Space>
          <Badge status="processing" text="Live" />
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={refreshing}
          >
            Refresh
          </Button>
          <Button icon={<DownloadOutlined />}>
            Export Report
          </Button>
        </Space>
      </div>

      {/* Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '12px' }}>
            <Statistic
              title="Overall Fairness"
              value={metrics.overall_fairness || 0}
              suffix="%"
              precision={1}
              valueStyle={{ color: (metrics.overall_fairness || 0) > 80 ? '#10b981' : '#f59e0b' }}
              prefix={<SafetyOutlined />}
            />
            <Progress 
              percent={metrics.overall_fairness || 0} 
              showInfo={false} 
              strokeColor={(metrics.overall_fairness || 0) > 80 ? '#10b981' : '#f59e0b'} 
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '12px' }}>
            <Statistic
              title="Drift Score"
              value={metrics.drift_score || 0}
              precision={3}
              valueStyle={{ color: (metrics.drift_score || 0) > 0.2 ? '#ef4444' : '#f59e0b' }}
              prefix={<ExperimentOutlined />}
            />
            <Text type="secondary">Threshold: 0.20</Text>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '12px' }}>
            <Statistic
              title="Protected Groups"
              value={protectedGroups.length}
              prefix={<TeamOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Badge status="success" text={`${protectedGroups.filter(g => g.status === 'good').length} Good`} />
              <br />
              <Badge status="warning" text={`${protectedGroups.filter(g => g.status === 'warning').length} Warning`} />
              <br />
              <Badge status="error" text={`${protectedGroups.filter(g => g.status === 'critical').length} Critical`} />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: '12px' }}>
            <Statistic
              title="Drift Events"
              value={recentDrifts.length}
              prefix={<BarChartOutlined />}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Last 24 hours</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Protected Group Analysis Table */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={24}>
          <Card 
            title={
              <span>
                <TeamOutlined style={{ marginRight: 8, color: '#8b5cf6' }} />
                Protected Group Analysis
              </span>
            }
            style={{ borderRadius: '12px' }}
          >
            {protectedGroups.length > 0 ? (
              <Table 
                columns={columns} 
                dataSource={protectedGroups} 
                rowKey="group"
                size="middle"
                pagination={false}
              />
            ) : (
              <Empty description="No protected groups analyzed" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Drift Events */}
      {recentDrifts.length > 0 && (
        <Card 
          title={
            <span>
              <WarningOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
              Recent Drift Events
            </span>
          }
          style={{ borderRadius: '12px' }}
        >
          <List
            dataSource={recentDrifts}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: item.status === 'error' ? '#ef444420' :
                                item.status === 'warning' ? '#f59e0b20' :
                                '#10b98120',
                      color: item.status === 'error' ? '#ef4444' :
                             item.status === 'warning' ? '#f59e0b' :
                             '#10b981'
                    }}>
                      {item.status === 'error' ? <CloseCircleOutlined /> : 
                       item.status === 'warning' ? <WarningOutlined /> : 
                       <CheckCircleOutlined />}
                    </div>
                  }
                  title={`${item.model} - ${item.metric}`}
                  description={
                    <Space>
                      <ClockCircleOutlined style={{ fontSize: '12px', color: '#94a3b8' }} />
                      <Text type="secondary">{item.time}</Text>
                      <Tag color={item.status === 'error' ? 'red' : 
                                item.status === 'warning' ? 'orange' : 'green'}>
                        {item.change}
                      </Tag>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default Monitor;