import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Typography,
  Divider,
  Spin,
  Alert,
  Row,
  Col,
  Statistic,
  Progress,
  Switch,
  message,
  Select
} from "antd";
import { SafetyOutlined } from "@ant-design/icons";
import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const { Title, Text } = Typography;
const { Option } = Select;

const BiasAnalysis = () => {

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [applyMitigation, setApplyMitigation] = useState(true);

  // 🔥 DATASET LIST
  const [datasets, setDatasets] = useState([]);

  // 🔥 COMPARISON
  const [comparison, setComparison] = useState(null);
  const [selectedOriginal, setSelectedOriginal] = useState("");
  const [selectedSynthetic, setSelectedSynthetic] = useState("");

  // ==============================
  // 🔥 LOAD DATASETS FROM BACKEND
  // ==============================
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/datasets/")
      .then(res => res.json())
      .then(data => {
        setDatasets(data || []);
      })
      .catch(() => {
        message.error("Failed to load datasets");
      });
  }, []);

  // ==============================
  // 1️⃣ Bias Analysis
  // ==============================
  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bias/analyze-bias",
        {
          apply_mitigation: applyMitigation
        }
      );

      setResult(response.data);
      message.success("Bias Analysis Completed");

    } catch (error) {
      setResult({ error: "Failed to analyze bias" });
      message.error("Analysis Failed");
    }

    setLoading(false);
  };

  // ==============================
  // 2️⃣ Compare Datasets
  // ==============================
  const handleCompare = async () => {

    if (!selectedOriginal || !selectedSynthetic) {
      message.error("Select both datasets");
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/bias/compare-datasets",
        {
          original_dataset: selectedOriginal,
          synthetic_dataset: selectedSynthetic
        }
      );

      setComparison(response.data);
      message.success("Comparison Completed");

    } catch (error) {
      message.error("Comparison failed");
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>
        <SafetyOutlined style={{ marginRight: 8 }} />
        Bias Analysis
      </Title>

      <Text type="secondary">
        Analyze and compare fairness of datasets
      </Text>

      <Divider />

      {/* ===============================
          ANALYSIS SECTION
      =============================== */}
      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Text strong>Enable Bias Mitigation</Text>
            <br />
            <Switch
              checked={applyMitigation}
              onChange={(checked) => setApplyMitigation(checked)}
              style={{ marginTop: 8 }}
            />
          </Col>

          <Col>
            <Button
              type="primary"
              size="large"
              onClick={handleAnalyze}
              loading={loading}
            >
              Run Bias Analysis
            </Button>
          </Col>
        </Row>
      </Card>

      {loading && (
        <Card style={{ textAlign: "center", padding: 40 }}>
          <Spin size="large" tip="Training model and evaluating fairness..." />
        </Card>
      )}

      {result && !result.error && (
        <Card title="Bias Report" style={{ borderRadius: 12, marginBottom: 24 }}>
          <Row gutter={[16, 16]}>

            <Col span={24}>
              <Statistic
                title="Final Fairness Score"
                value={result.fairness_score}
                suffix="%"
                precision={2}
              />
              <Progress percent={result.fairness_score} />
            </Col>

            <Col span={12}>
              <Statistic
                title="Original Fairness"
                value={result.original_fairness}
                suffix="%"
                precision={2}
              />
            </Col>

            <Col span={12}>
              <Statistic
                title="Mitigated Fairness"
                value={result.mitigated_fairness}
                suffix="%"
                precision={2}
              />
            </Col>

            <Col span={12}>
              <Statistic
                title="Demographic Parity Difference"
                value={result.demographic_parity_difference}
                precision={4}
              />
            </Col>

            <Col span={12}>
              <Statistic
                title="Equalized Odds Difference"
                value={result.equalized_odds_difference}
                precision={4}
              />
            </Col>

            <Col span={24}>
              <Statistic
                title="Model Accuracy"
                value={result.accuracy}
                suffix="%"
                precision={2}
              />
            </Col>

          </Row>
        </Card>
      )}

      {/* ===============================
          COMPARISON SECTION
      =============================== */}
      <Card title="Compare Original vs Synthetic" style={{ borderRadius: 12 }}>

        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Select
              placeholder="Original Dataset"
              style={{ width: "100%" }}
              onChange={(val) => setSelectedOriginal(val)}
            >
              {datasets.map((ds, index) => (
                <Option key={index} value={ds.name}>
                  {ds.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={8}>
            <Select
              placeholder="Synthetic Dataset"
              style={{ width: "100%" }}
              onChange={(val) => setSelectedSynthetic(val)}
            >
              {datasets.map((ds, index) => (
                <Option key={index} value={ds.name}>
                  {ds.name}
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={8}>
            <Button type="primary" onClick={handleCompare}>
              Compare Original vs Synthetic
            </Button>
          </Col>
        </Row>

        {comparison && (
          <>
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Statistic
                  title="Original Fairness"
                  value={comparison.original_fairness}
                  suffix="%"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Synthetic Fairness"
                  value={comparison.synthetic_fairness}
                  suffix="%"
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Statistic
                  title="Original Accuracy"
                  value={comparison.original_accuracy}
                  suffix="%"
                  precision={2}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Synthetic Accuracy"
                  value={comparison.synthetic_accuracy}
                  suffix="%"
                  precision={2}
                />
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <Statistic
                  title="Data Quality Score"
                  value={comparison.data_quality_score}
                  suffix="%"
                  precision={2}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Overall Similarity"
                  value={comparison.overall_similarity}
                  suffix="/1"
                  precision={4}
                />
              </Col>
            </Row>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: "Original",
                    DP: Math.abs(comparison.original_dp)
                  },
                  {
                    name: "Synthetic",
                    DP: Math.abs(comparison.synthetic_dp)
                  }
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="DP" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

      </Card>
    </div>
  );
};

export default BiasAnalysis;