const axios = require('axios');

async function testOllama() {
  try {
    console.log('Testing Ollama connection...');
    const response = await axios.get('http://localhost:11434/api/tags', {
      timeout: 5000
    });
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    // Test generation
    const genResponse = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt: 'What is debt? Answer in one sentence.',
      stream: false,
      temperature: 0.7,
      top_p: 0.9
    }, {
      timeout: 15000
    });
    
    console.log('Generation response:', genResponse.data.response);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Full error:', error);
  }
}

testOllama();
