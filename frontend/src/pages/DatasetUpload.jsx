import React, { useState } from 'react';
import {
  UploadOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  InboxOutlined
} from '@ant-design/icons';
import {
  Card,
  Button,
  Upload,
  Input,
  Select,
  Form,
  Alert,
  message,
  Progress,
  Space,
  Typography
} from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Dragger } = Upload;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

const DatasetUpload = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();   // ✅ navigation added

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0]);

    setUploading(true);
    setUploadStatus(null);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/upload-dataset',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Upload success:', response.data);

      setUploadStatus('success');
      message.success('Dataset uploaded successfully!');

      // ✅ REDIRECT AFTER SUCCESS
      navigate('/bias-analysis');

    } catch (error) {
      console.error(error);
      message.error('Upload failed!');
    }

    setUploading(false);
  };

  const uploadProps = {
    beforeUpload: (file) => {
      if (file.type !== 'text/csv') {
        message.error(`${file.name} is not a CSV file`);
        return Upload.LIST_IGNORE;
      }

      setFileList([file]); // only one file
      return false;
    },
    onRemove: () => {
      setFileList([]);
    },
    fileList,
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{
        marginBottom: '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        <FileTextOutlined style={{ marginRight: '12px' }} />
        Upload Dataset
      </Title>

      <Text type="secondary" style={{ display: 'block', marginBottom: '32px' }}>
        Upload your healthcare dataset for bias analysis
      </Text>

      <Card bordered={false} style={{
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        borderRadius: '12px'
      }}>

        <Form form={form} layout="vertical" onFinish={handleUpload}>

          <Form.Item
            name="file"
            label="Dataset File (CSV only)"
            rules={[{ required: true, message: 'Please upload a CSV file' }]}
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: '48px', color: '#667eea' }} />
              </p>
              <p>Click or drag CSV file to upload</p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<UploadOutlined />}
                loading={uploading}
                disabled={fileList.length === 0}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                Upload Dataset
              </Button>

              <Button
                onClick={() => {
                  setFileList([]);
                  form.resetFields();
                }}
              >
                Clear
              </Button>
            </Space>
          </Form.Item>

          {uploadStatus === 'success' && (
            <Alert
              message="Upload Successful!"
              type="success"
              showIcon
              icon={<CheckCircleOutlined />}
            />
          )}

        </Form>
      </Card>
    </div>
  );
};

export default DatasetUpload;

