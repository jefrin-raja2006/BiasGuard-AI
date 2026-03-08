import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChartOutlined,
  TableOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  FileTextOutlined,
  SafetyOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Space,
  Table,
  Descriptions,
  Tag,
  Divider,
  Progress,
  Alert,
  Spin,
  Statistic,
  Tabs
} from 'antd';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const API_BASE_URL = 'http://localhost:8000';

const CompareData = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState(null);
  
  // Get filenames from location state
  const { originalFile, syntheticFile } = location.state || {};

  useEffect(() => {
    if (!originalFile || !syntheticFile) {
      setError('No files selected for comparison');
      return;
    }
    
    fetchComparison();
  }, [originalFile, syntheticFile]);

  const fetchComparison = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/synthesis/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          original_file: originalFile,
          synthetic_file: syntheticFile
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || 'Comparison failed');
      }

      setComparison(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/download/${filename}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '20px' }}>Comparing datasets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <WarningOutlined style={{ fontSize: '48px', color: '#ef4444' }} />
        <Title level={3}>Comparison Failed</Title>
        <Alert message={error} type="error" showIcon />
        <Button 
          type="primary" 
          onClick={() => navigate('/synthesis')}
          style={{ marginTop: '20px' }}
        >
          Back to Generator
        </Button>
      </div>
    );
  }

  if (!comparison) {
    return null;
  }

  const { original, synthetic, similarity_score, similarity_metrics } = comparison;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/synthesis')}
          >
            Back
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            <BarChartOutlined style={{ marginRight: '8px', color: '#667eea' }} />
            Original vs Synthetic Comparison
          </Title>
        </Space>
      </div>

      {/* Similarity Score */}
      <Card style={{ marginBottom: '24px', background: '#f0f9ff' }}>
        <Row align="middle">
          <Col span={6}>
            <Statistic 
              title="Overall Similarity" 
              value={similarity_score} 
              suffix="%"
              valueStyle={{ color: similarity_score > 80 ? '#10b981' : '#f59e0b' }}
            />
          </Col>
          <Col span={18}>
            <Progress 
              percent={similarity_score} 
              status={similarity_score > 80 ? "success" : "normal"}
              strokeColor={similarity_score > 80 ? '#10b981' : '#f59e0b'}
              format={(percent) => `${percent}% Similar`}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        {/* Original Dataset */}
        <Col span={12}>
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: '#667eea' }} />
                <span>Original: {original.filename}</span>
              </Space>
            }
            extra={
              <Button 
                icon={<DownloadOutlined />} 
                size="small"
                onClick={() => handleDownload(original.filename)}
              >
                Download
              </Button>
            }
          >
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Rows">{original.rows.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Columns">{original.columns}</Descriptions.Item>
              <Descriptions.Item label="Missing Values">
                <Tag color={original.missing_values === 0 ? 'green' : 'orange'}>
                  {original.missing_values}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Duplicates">
                <Tag color={original.duplicates === 0 ? 'green' : 'orange'}>
                  {original.duplicates}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Column Names</Divider>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {original.column_names.map(col => (
                <Tag key={col} style={{ margin: '4px' }}>{col}</Tag>
              ))}
            </div>
          </Card>
        </Col>

        {/* Synthetic Dataset */}
        <Col span={12}>
          <Card 
            title={
              <Space>
                <FileTextOutlined style={{ color: '#10b981' }} />
                <span>Synthetic: {synthetic.filename}</span>
              </Space>
            }
            extra={
              <Button 
                icon={<DownloadOutlined />} 
                size="small"
                onClick={() => handleDownload(synthetic.filename)}
              >
                Download
              </Button>
            }
          >
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Rows">{synthetic.rows.toLocaleString()}</Descriptions.Item>
              <Descriptions.Item label="Columns">{synthetic.columns}</Descriptions.Item>
              <Descriptions.Item label="Missing Values">
                <Tag color={synthetic.missing_values === 0 ? 'green' : 'orange'}>
                  {synthetic.missing_values}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Duplicates">
                <Tag color={synthetic.duplicates === 0 ? 'green' : 'orange'}>
                  {synthetic.duplicates}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Column Names</Divider>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {synthetic.column_names.map(col => (
                <Tag key={col} style={{ margin: '4px' }}>{col}</Tag>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Detailed Comparison */}
      {similarity_metrics && (
        <Card style={{ marginTop: '24px' }}>
          <Tabs defaultActiveKey="1">
            {similarity_metrics.numerical_stats && (
              <TabPane tab="Numerical Columns" key="1">
                {Object.entries(similarity_metrics.numerical_stats).map(([col, stats]) => (
                  <Card key={col} size="small" style={{ marginBottom: '16px' }}>
                    <Title level={5}>{col}</Title>
                    <Table
                      dataSource={[
                        { metric: 'Mean', original: stats.original_mean.toFixed(2), synthetic: stats.synthetic_mean.toFixed(2) },
                        { metric: 'Std Dev', original: stats.original_std.toFixed(2), synthetic: stats.synthetic_std.toFixed(2) },
                        { metric: 'Min', original: stats.original_min.toFixed(2), synthetic: stats.synthetic_min.toFixed(2) },
                        { metric: 'Max', original: stats.original_max.toFixed(2), synthetic: stats.synthetic_max.toFixed(2) }
                      ]}
                      columns={[
                        { title: 'Metric', dataIndex: 'metric', key: 'metric' },
                        { title: 'Original', dataIndex: 'original', key: 'original' },
                        { title: 'Synthetic', dataIndex: 'synthetic', key: 'synthetic' }
                      ]}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                ))}
              </TabPane>
            )}

            {similarity_metrics.categorical_stats && (
              <TabPane tab="Categorical Columns" key="2">
                {Object.entries(similarity_metrics.categorical_stats).map(([col, stats]) => (
                  <Card key={col} size="small" style={{ marginBottom: '16px' }}>
                    <Title level={5}>{col}</Title>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Text strong>Original Categories ({stats.original_unique})</Text>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '8px' }}>
                          {Object.entries(stats.original_categories).map(([cat, count]) => (
                            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <Tag>{cat}</Tag>
                              <span>{count}</span>
                            </div>
                          ))}
                        </div>
                      </Col>
                      <Col span={12}>
                        <Text strong>Synthetic Categories ({stats.synthetic_unique})</Text>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '8px' }}>
                          {Object.entries(stats.synthetic_categories).map(([cat, count]) => (
                            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <Tag>{cat}</Tag>
                              <span>{count}</span>
                            </div>
                          ))}
                        </div>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </TabPane>
            )}
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default CompareData;