import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADDED for navigation
import { 
  DatabaseOutlined, 
  SettingOutlined, 
  PlayCircleOutlined, 
  DownloadOutlined, 
  WarningOutlined, 
  CheckCircleOutlined,
  SafetyOutlined,
  BarChartOutlined,
  FileTextOutlined,
  ReloadOutlined,
  CloudServerOutlined,
  ExperimentOutlined  // ✅ ADDED for compare icon
} from '@ant-design/icons';
import { 
  Card, 
  Button, 
  Select, 
  InputNumber, 
  Switch, 
  Radio, 
  Space, 
  Alert, 
  Progress,
  Statistic,
  Row,
  Col,
  Divider,
  message,
  Steps,
  Tag,
  Spin,
  Empty,
  Descriptions,
  Badge
} from 'antd';

const { Option } = Select;
const { Step } = Steps;

const API_BASE_URL = 'http://localhost:8000';

const SynthesisGenerator = () => {
  const navigate = useNavigate(); // ✅ ADDED for navigation
  const [currentStep, setCurrentStep] = useState(0);
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null); // ✅ ADDED to store selected dataset info
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');
  
  const [config, setConfig] = useState({
    datasetId: '',
    method: 'gan',
    sampleSize: 1000,
    fairnessConstraints: true,
    privacyEnabled: true
  });

  // Check backend connection
  useEffect(() => {
    checkBackend();
  }, []);

  const checkBackend = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/`);
      if (res.ok) {
        setBackendStatus('connected');
        fetchDatasets();
      } else {
        setBackendStatus('error');
      }
    } catch {
      setBackendStatus('error');
    }
  };

  // Fetch REAL datasets from backend
  const fetchDatasets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/datasets`);
      const data = await res.json();
      setDatasets(data);
    } catch (err) {
      message.error('Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  // Handle dataset selection
  const handleDatasetChange = (value) => {
    setConfig({...config, datasetId: value});
    // Find and store selected dataset info
    const dataset = datasets.find(d => d.id === value);
    setSelectedDataset(dataset);
  };

  // Generate synthetic data
  const handleGenerate = async () => {
    if (!config.datasetId) {
      message.error('Select a dataset');
      return;
    }

    setGenerating(true);
    setCurrentStep(1);
    setGeneratedData(null); // Clear previous data

    try {
      const res = await fetch(`${API_BASE_URL}/api/synthesis/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataset_id: config.datasetId,
          method: config.method,
          sample_size: config.sampleSize,
          fairness_constraints: config.fairnessConstraints,
          privacy_enabled: config.privacyEnabled
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.detail);

      setGeneratedData({
        id: data.id,
        samples: data.samples_generated,
        columns: data.columns,
        fairnessScore: data.fairness_score,
        qualityScore: data.quality_score,
        privacyScore: data.privacy_score,
        filename: data.filename,
        originalFilename: data.original_filename, // ✅ IMPORTANT: Store original filename
        fairnessApplied: data.fairness_applied,
        privacyApplied: data.privacy_applied,
        downloadUrl: data.download_url
      });
      
      setCurrentStep(2);
      message.success('Generation complete');
      
    } catch (err) {
      message.error(err.message);
      setCurrentStep(0);
    } finally {
      setGenerating(false);
    }
  };

  // Download function
  const handleDownload = async () => {
    if (!generatedData?.filename) {
      message.error('No file to download');
      return;
    }

    setDownloading(true);
    try {
      const downloadUrl = `${API_BASE_URL}/api/download/${generatedData.filename}`;
      const response = await fetch(downloadUrl);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = generatedData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      message.success('Download started');
      
    } catch (err) {
      console.error('Download error:', err);
      message.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  // ✅ NEW: Compare function
  const handleCompare = () => {
    if (!generatedData?.originalFilename || !generatedData?.filename) {
      message.error('No files to compare');
      return;
    }
    
    // Navigate to compare page with file information
    navigate('/compare', {
      state: {
        originalFile: generatedData.originalFilename,
        syntheticFile: generatedData.filename,
        originalName: selectedDataset?.name || generatedData.originalFilename,
        syntheticName: generatedData.filename
      }
    });
  };

  const steps = [
    { title: 'Configure', description: 'Set parameters' },
    { title: 'Generating', description: 'Creating synthetic data' },
    { title: 'Complete', description: 'Ready to download' }
  ];

  if (backendStatus === 'checking') {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
        <p>Connecting to backend...</p>
      </div>
    );
  }

  if (backendStatus === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <CloudServerOutlined style={{ fontSize: '64px', color: '#ef4444' }} />
        <h2>Backend Not Connected</h2>
        <Alert message="Cannot connect to backend server. Please make sure it's running on port 8000." type="error" />
        <Button onClick={checkBackend} style={{ marginTop: '20px' }}>Retry</Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>
        <DatabaseOutlined style={{ marginRight: '8px', color: '#667eea' }} />
        Synthetic Data Generator
      </h1>

      <Steps current={currentStep} style={{ marginBottom: '32px' }}>
        {steps.map(s => <Step key={s.title} {...s} />)}
      </Steps>

      <Row gutter={16}>
        {/* Configuration Column */}
        <Col span={12}>
          <Card 
            title="Configuration" 
            extra={
              <Button type="link" icon={<ReloadOutlined />} onClick={fetchDatasets}>
                Refresh
              </Button>
            }
          >
            {loading ? <Spin /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label>Select Dataset *</label>
                  <Select
                    style={{ width: '100%', marginTop: '8px' }}
                    size="large"
                    placeholder="Choose a dataset"
                    value={config.datasetId || undefined}
                    onChange={handleDatasetChange}
                  >
                    {datasets.map(ds => (
                      <Option key={ds.id} value={ds.id}>
                        <FileTextOutlined /> {ds.name} ({ds.rows} rows, {ds.columns} cols)
                      </Option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label>Generation Method</label>
                  <Radio.Group 
                    value={config.method}
                    onChange={e => setConfig({...config, method: e.target.value})}
                    style={{ marginTop: '8px', width: '100%' }}
                    buttonStyle="solid"
                  >
                    <Radio.Button value="gan" style={{ width: '33.33%', textAlign: 'center' }}>
                      <BarChartOutlined /> GAN
                    </Radio.Button>
                    <Radio.Button value="vae" style={{ width: '33.33%', textAlign: 'center' }}>
                      <DatabaseOutlined /> VAE
                    </Radio.Button>
                    <Radio.Button value="diffusion" style={{ width: '33.34%', textAlign: 'center' }}>
                      <SettingOutlined /> Diffusion
                    </Radio.Button>
                  </Radio.Group>
                </div>

                <div>
                  <label>Samples: {config.sampleSize}</label>
                  <InputNumber
                    min={100}
                    max={10000}
                    value={config.sampleSize}
                    onChange={v => setConfig({...config, sampleSize: v})}
                    style={{ width: '100%', marginTop: '8px' }}
                    size="large"
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  />
                </div>

                <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '12px' }}>
                    <Switch 
                      checked={config.fairnessConstraints}
                      onChange={c => setConfig({...config, fairnessConstraints: c})}
                    /> 
                    <span style={{ marginLeft: '8px' }}>Apply Fairness Constraints</span>
                  </div>
                  <div>
                    <Switch 
                      checked={config.privacyEnabled}
                      onChange={c => setConfig({...config, privacyEnabled: c})}
                    /> 
                    <span style={{ marginLeft: '8px' }}>Differential Privacy</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  onClick={handleGenerate}
                  loading={generating}
                  disabled={!config.datasetId}
                  block
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  {generating ? 'Generating...' : 'Generate Synthetic Data'}
                </Button>
              </div>
            )}
          </Card>
        </Col>

        {/* Results Column */}
        <Col span={12}>
          <Card title="Generation Results" style={{ minHeight: '500px' }}>
            {generating ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <Spin size="large" />
                <p style={{ marginTop: '20px' }}>Generating synthetic data...</p>
                <Progress percent={60} status="active" style={{ width: '80%', margin: '20px auto' }} />
              </div>
            ) : generatedData ? (
              <div>
                <Alert 
                  message={
                    <Space>
                      <CheckCircleOutlined />
                      <span>Generation Complete!</span>
                    </Space>
                  } 
                  type="success" 
                  showIcon 
                />
                
                <Row gutter={16} style={{ marginTop: '20px' }}>
                  <Col span={8}>
                    <Statistic 
                      title="Samples" 
                      value={generatedData.samples} 
                      valueStyle={{ color: '#667eea' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Columns" 
                      value={generatedData.columns} 
                      valueStyle={{ color: '#10b981' }}
                    />
                  </Col>
                  <Col span={8}>
                    <Statistic 
                      title="Fairness" 
                      value={generatedData.fairnessScore} 
                      suffix="%"
                      valueStyle={{ color: '#f59e0b' }}
                    />
                  </Col>
                </Row>

                <Divider />

                <Descriptions bordered size="small" column={2}>
                  <Descriptions.Item label="Fairness Applied">
                    <Badge status={generatedData.fairnessApplied ? "success" : "default"} 
                           text={generatedData.fairnessApplied ? "Yes" : "No"} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Privacy">
                    <Badge status={generatedData.privacyApplied ? "success" : "default"} 
                           text={generatedData.privacyApplied ? "Enabled" : "Disabled"} />
                  </Descriptions.Item>
                  <Descriptions.Item label="Quality Score">
                    <Tag color="blue">{generatedData.qualityScore}%</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Privacy Score">
                    <Tag color="purple">{generatedData.privacyScore}%</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Original File" span={2}>
                    <Tag color="green">{generatedData.originalFilename || 'Unknown'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Synthetic File" span={2}>
                    <Tag color="orange">{generatedData.filename}</Tag>
                  </Descriptions.Item>
                </Descriptions>

                {/* Action Buttons */}
                <Space direction="vertical" size="middle" style={{ width: '100%', marginTop: '20px' }}>
                  <Button 
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                    loading={downloading}
                    block
                    style={{ 
                      background: '#10b981', 
                      border: 'none',
                      height: '44px'
                    }}
                  >
                    {downloading ? 'Downloading...' : 'Download CSV'}
                  </Button>

                  {/* ✅ NEW: Compare Button */}
                  <Button 
                    icon={<ExperimentOutlined />}
                    onClick={handleCompare}
                    block
                    style={{ 
                      height: '44px',
                      border: '2px solid #667eea',
                      color: '#667eea',
                      fontWeight: '500'
                    }}
                  >
                    Compare Original vs Synthetic
                  </Button>
                </Space>
              </div>
            ) : (
              <Empty 
                description={
                  <span>
                    <DatabaseOutlined style={{ fontSize: '48px', opacity: 0.3, display: 'block', marginBottom: '16px' }} />
                    No data generated yet<br />
                    Select a dataset and click generate
                  </span>
                } 
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SynthesisGenerator;