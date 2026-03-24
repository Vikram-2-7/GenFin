import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, Copy, Check, AlertCircle, Zap, CheckCircle, XCircle, Loader } from 'lucide-react';

interface ServiceStatus {
  name: string;
  port: number;
  status: 'connected' | 'disconnected' | 'checking';
  latency?: number;
  message?: string;
}

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  latency?: number;
  response?: any;
  error?: string;
}

export default function OllamaSetupValidator() {
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'MongoDB', port: 27017, status: 'checking' },
    { name: 'GenFin Backend', port: 5000, status: 'checking' },
    { name: 'Ollama Server', port: 11434, status: 'checking' }
  ]);

  const [testResults, setTestResults] = useState<TestResult[]>([
    { endpoint: 'POST /api/slm/health', status: 'pending' },
    { endpoint: 'POST /api/slm/analyze', status: 'pending' },
    { endpoint: 'POST /api/slm/quick-summary', status: 'pending' },
    { endpoint: 'POST /api/slm/insights', status: 'pending' },
    { endpoint: 'POST /api/slm/action-plan', status: 'pending' },
    { endpoint: 'POST /api/slm/risk-assessment', status: 'pending' },
    { endpoint: 'POST /api/slm/explain', status: 'pending' }
  ]);

  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [ollamaProgress, setOllamaProgress] = useState(0);
  const [setupStep, setSetupStep] = useState(0);

  // Check service connectivity
  useEffect(() => {
    const checkServices = async () => {
      const newServices = [...services];

      // Check MongoDB (via backend health – assumes Mongo connected there)
      try {
        const start = Date.now();
        const response = await fetch('http://localhost:5000/api/health', {
          signal: AbortSignal.timeout(2000)
        });
        if (response.ok) {
          newServices[0].status = 'connected';
          newServices[0].latency = Date.now() - start;
        } else {
          newServices[0].status = 'disconnected';
          newServices[0].message = 'Connection refused';
        }
      } catch {
        newServices[0].status = 'disconnected';
        newServices[0].message = 'Connection timeout';
      }

      // Check Backend
      try {
        const start = Date.now();
        const response = await fetch('http://localhost:5000/api/health', {
          signal: AbortSignal.timeout(2000)
        });
        if (response.ok) {
          newServices[1].status = 'connected';
          newServices[1].latency = Date.now() - start;
        } else {
          newServices[1].status = 'disconnected';
          newServices[1].message = 'Server not responding';
        }
      } catch {
        newServices[1].status = 'disconnected';
        newServices[1].message = 'Connection failed';
      }

      // Check Ollama
      try {
        const start = Date.now();
        const response = await fetch('http://localhost:11434/api/tags', {
          signal: AbortSignal.timeout(2000)
        });
        if (response.ok) {
          newServices[2].status = 'connected';
          newServices[2].latency = Date.now() - start;
          setSetupStep(1); // Ollama is running
        } else {
          newServices[2].status = 'disconnected';
          newServices[2].message = 'Server not responding';
        }
      } catch {
        newServices[2].status = 'disconnected';
        newServices[2].message = 'Not installed or not running';
      }

      setServices(newServices);
    };

    const timer = setInterval(checkServices, 3000);
    checkServices();
    return () => clearInterval(timer);
  }, []);

  const runTests = async () => {
    const newResults = [...testResults];
    const mockUserData = {
      monthlyIncome: 75000,
      expenses: {
        rent: 15000,
        groceries: 5000,
        utilities: 2000,
        entertainment: 3000,
        transport: 2000,
        shopping: 3000
      },
      savings: 12000,
      investments: 25000,
      debts: 500000,
      age: 28,
      riskTolerance: 'moderate'
    };

    for (let i = 0; i < newResults.length; i++) {
      const test = newResults[i];
      const endpoint = test.endpoint.split(' ')[1].replace('/api/slm/', '');

      try {
        const start = Date.now();
        const response = await fetch(`http://localhost:5000/api/slm/${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(mockUserData),
          signal: AbortSignal.timeout(10000)
        });

        const latency = Date.now() - start;

        if (response.ok) {
          const data = await response.json();
          newResults[i] = {
            endpoint: test.endpoint,
            status: 'success',
            latency,
            response: data
          };
        } else {
          newResults[i] = {
            endpoint: test.endpoint,
            status: 'error',
            latency,
            error: `HTTP ${response.status}: ${response.statusText}`
          };
        }
      } catch (error) {
        newResults[i] = {
          endpoint: test.endpoint,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      setTestResults([...newResults]);
    }
  };

  const copyResponse = (response: any) => {
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="text-emerald-400" size={20} />;
      case 'disconnected':
        return <XCircle className="text-red-400" size={20} />;
      case 'checking':
        return <Loader className="text-blue-400 animate-spin" size={20} />;
      default:
        return <AlertCircle className="text-amber-400" size={20} />;
    }
  };

  const connectedCount = services.filter(s => s.status === 'connected').length;

  return (
    <div className="w-full space-y-6 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-slate-700 rounded-xl p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-5xl">🤖</div>
          <div>
            <h1 className="text-4xl font-bold">Ollama Setup & SLM API Validator</h1>
            <p className="text-slate-400">Test your financial AI system installation</p>
          </div>
        </div>

        {/* Overall Status */}
        <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">System Status</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                {connectedCount === 3 ? '✅ All Systems Ready' : `⚠️ ${connectedCount}/3 Services Connected`}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                {connectedCount === 3
                  ? 'All services running. Ready for full SLM testing.'
                  : `${3 - connectedCount} service${3 - connectedCount > 1 ? 's' : ''} offline. See below for setup instructions.`}
              </p>
            </div>
            <Zap className={connectedCount === 3 ? 'text-emerald-400' : 'text-amber-400'} size={32} />
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-slate-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4">Services Status</h2>
        <div className="space-y-3">
          {services.map((service, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                service.status === 'connected'
                  ? 'bg-emerald-900/20 border-emerald-500/50'
                  : service.status === 'checking'
                    ? 'bg-blue-900/20 border-blue-500/50'
                    : 'bg-red-900/20 border-red-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(service.status)}
                <div>
                  <p className="font-semibold text-white">{service.name}</p>
                  <p className="text-xs text-slate-400">
                    localhost:{service.port}
                    {service.message && ` — ${service.message}`}
                  </p>
                </div>
              </div>
              {service.status === 'connected' && service.latency && (
                <p className="text-sm font-semibold text-emerald-400">{service.latency}ms</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ollama Setup Guide */}
      {services[2].status === 'disconnected' && (
        <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border-2 border-amber-600 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-amber-400" size={24} />
            <h2 className="text-2xl font-bold text-amber-200">Ollama Not Running</h2>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-amber-300 font-semibold mb-2">Quick Setup (Windows)</p>
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm overflow-x-auto border border-slate-700">
                <div className="text-slate-400">
                  <p># 1. Download from: https://ollama.ai</p>
                  <p># 2. Run installer and complete installation</p>
                  <p># 3. Open PowerShell and pull Mistral model:</p>
                  <p className="text-emerald-400 mt-2">ollama pull mistral</p>
                  <p className="text-slate-400 mt-2"># ~5-10 minutes, 5GB download</p>
                  <p># 4. Ollama will auto-start on http://localhost:11434</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-amber-300 font-semibold mb-2">For Mac/Linux</p>
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm border border-slate-700">
                <div className="text-slate-400">
                  <p># Mac: brew install ollama</p>
                  <p># Linux: curl https://ollama.ai/install.sh | sh</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
              <p className="text-blue-200 text-sm">
                📚 See <strong>SLM/SETUP_GUIDE.md</strong> for detailed instructions with screenshots
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Tests */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-slate-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">SLM API Endpoint Tests</h2>
          <button
            onClick={runTests}
            disabled={services[1].status !== 'connected'}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
              services[1].status === 'connected'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-slate-700 cursor-not-allowed opacity-50'
            }`}
          >
            <Play size={18} />
            Run All Tests
          </button>
        </div>

        {/* Test Results Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">LLM-Enabled Endpoints</p>
            <p className="text-2xl font-bold text-blue-400">
              {testResults.filter(t => ['analyze', 'quick-summary', 'insights', 'explain'].some(x => t.endpoint.includes(x)) && t.status === 'success').length}/4
            </p>
            <p className="text-xs text-slate-400 mt-1">Need Ollama running</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <p className="text-slate-400 text-sm">Rule-Based Endpoints</p>
            <p className="text-2xl font-bold text-emerald-400">
              {testResults.filter(t => ['action-plan', 'risk-assessment'].some(x => t.endpoint.includes(x)) && t.status === 'success').length}/2
            </p>
            <p className="text-xs text-slate-400 mt-1">Work without Ollama</p>
          </div>
        </div>

        {/* Test Results List */}
        <div className="space-y-2">
          {testResults.map((test, idx) => (
            <div key={idx}>
              <button
                onClick={() => setSelectedTest(selectedTest?.endpoint === test.endpoint ? null : test)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all text-left ${
                  test.status === 'success'
                    ? 'bg-emerald-900/20 border-emerald-500/50 hover:bg-emerald-900/30'
                    : test.status === 'error'
                      ? 'bg-red-900/20 border-red-500/50 hover:bg-red-900/30'
                      : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  {test.status === 'success' && <CheckCircle className="text-emerald-400" size={20} />}
                  {test.status === 'error' && <XCircle className="text-red-400" size={20} />}
                  {test.status === 'pending' && <AlertCircle className="text-slate-500" size={20} />}
                  <div>
                    <p className="font-semibold text-white">{test.endpoint}</p>
                    {test.latency && <p className="text-xs text-slate-400">{test.latency}ms</p>}
                  </div>
                </div>
                <span className={`transition-transform ${selectedTest?.endpoint === test.endpoint ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Expanded Response */}
              {selectedTest?.endpoint === test.endpoint && (
                <div className="bg-slate-950 rounded-lg p-4 mt-2 border border-slate-700 space-y-3">
                  {test.status === 'success' && test.response && (
                    <>
                      <div>
                        <p className="text-sm font-semibold text-slate-400 mb-2">Response Preview</p>
                        <div className="bg-slate-900 rounded p-3 font-mono text-xs text-slate-300 overflow-x-auto max-h-64 overflow-y-auto">
                          <pre>{JSON.stringify(test.response, null, 2)}</pre>
                        </div>
                      </div>
                      <button
                        onClick={() => copyResponse(test.response)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-all"
                      >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied!' : 'Copy Response'}
                      </button>
                    </>
                  )}
                  {test.status === 'error' && (
                    <div className="bg-red-900/30 border border-red-500/50 rounded p-3">
                      <p className="text-red-200 text-sm font-mono">{test.error}</p>
                    </div>
                  )}
                  {test.status === 'pending' && (
                    <p className="text-slate-400 text-sm">Click "Run All Tests" to test this endpoint</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-2 border-purple-600 rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">✨ Next Steps</h3>
        <div className="space-y-3 text-slate-200">
          <div className="flex gap-3">
            <span className="text-purple-400 font-bold">1.</span>
            <div>
              <p className="font-semibold">Install & Start Ollama</p>
              <p className="text-sm text-slate-400">Download from ollama.ai, run installer, deploy Mistral model</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-purple-400 font-bold">2.</span>
            <div>
              <p className="font-semibold">Verify All Services</p>
              <p className="text-sm text-slate-400">Refresh this page to confirm all 3 services show connected</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-purple-400 font-bold">3.</span>
            <div>
              <p className="font-semibold">Run API Tests</p>
              <p className="text-sm text-slate-400">Click "Run All Tests" to validate all endpoints are working</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-purple-400 font-bold">4.</span>
            <div>
              <p className="font-semibold">Integrate Components</p>
              <p className="text-sm text-slate-400">Import the 5 new components (Budget, SLM, Investment, Goals, Testing) into your main app</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-purple-400 font-bold">5.</span>
            <div>
              <p className="font-semibold">Monitor Performance</p>
              <p className="text-sm text-slate-400">Use this page to test API health and fine-tune response times</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Links */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-3">📚 Documentation</h3>
        <div className="space-y-2 text-slate-300 text-sm">
          <p>• <strong>SLM/SETUP_GUIDE.md</strong> - Complete Ollama installation instructions</p>
          <p>• <strong>SLM/QUICK_REFERENCE.md</strong> - API endpoints and response formats</p>
          <p>• <strong>SLM/FRONTEND_INTEGRATION.md</strong> - How to integrate SLM in React components</p>
        </div>
      </div>
    </div>
  );
}
