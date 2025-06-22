# 🧠 Veridia

**AI Code Assistant powered by your own LLM models**

Veridia is a modern, self-hosted AI client that connects to your local LLM models via LM Studio. It provides intelligent code analysis, generation, and development assistance while keeping your data completely private.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)
![React](https://img.shields.io/badge/react-18.2%2B-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)

## ✨ Features

- 🔒 **100% Private**: Your code never leaves your machine
- 🚀 **Modern UI**: Clean React interface with Material-UI
- ⚡ **Fast API**: Python FastAPI backend for optimal performance
- 🎯 **Code-Focused**: Specialized for development workflows
- 🔧 **Easy Setup**: Simple configuration with LM Studio
- 📱 **Responsive**: Works on desktop and mobile browsers

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+**
- **Node.js 16+**
- **LM Studio** ([Download here](https://lmstudio.ai/))

### 1. Download LM Studio & Models

1. Download and install [LM Studio](https://lmstudio.ai/)
2. Download a recommended model (see [Recommended Models](#-recommended-models))
3. Start LM Studio and load your model
4. Enable the API server (default: `http://localhost:1234`)

### 2. Install Veridia

```bash
# Clone the repository
git clone https://github.com/nhexen/veridia.git
cd veridia

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure & Run

```bash
# Start the backend (from project root)
cd backend
uvicorn main:app --reload

# Start the frontend (in another terminal)
cd frontend
npm start
```

🎉 **Veridia is now running!**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🤖 Recommended Models

### For Code Generation
| Model                 | Size   | Best For                           | Download                                                                        |
| --------------------- | ------ | ---------------------------------- | ------------------------------------------------------------------------------- |
| **DeepSeek Coder V2** | 16B    | General coding, multiple languages | [Hugging Face](https://huggingface.co/deepseek-ai/deepseek-coder-6.7b-instruct) |
| **Code Llama**        | 7B-34B | Python, JavaScript, debugging      | [Meta AI](https://github.com/facebookresearch/codellama)                        |
| **Phind CodeLlama**   | 34B    | Complex problem solving            | [Hugging Face](https://huggingface.co/Phind/Phind-CodeLlama-34B-v2)             |
| **WizardCoder**       | 15B    | Code explanation, refactoring      | [Hugging Face](https://huggingface.co/WizardLM/WizardCoder-15B-V1.0)            |

### For General Development
| Model            | Size   | Best For             | Download                                                                    |
| ---------------- | ------ | -------------------- | --------------------------------------------------------------------------- |
| **Mixtral 8x7B** | 8x7B   | Balanced performance | [Hugging Face](https://huggingface.co/mistralai/Mixtral-8x7B-Instruct-v0.1) |
| **Llama 2**      | 7B-70B | General purpose      | [Meta AI](https://github.com/facebookresearch/llama)                        |

## ⚙️ Configuration

### LM Studio Setup
1. Open LM Studio
2. Go to **Developer** tab
3. Start the server on `localhost:1234`
4. Note your model name

### Veridia Configuration
Update `backend/main.py` with your model details:

```python
LM_STUDIO_API_URL = "http://localhost:1234/v1/chat/completions"
# Update the model name in the generate_code function
"model": "your-model-name-here"
```

## 📁 Project Structure

```
veridia/
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   └── requirements.txt # Python dependencies
├── frontend/            # React frontend
│   ├── src/
│   │   ├── App.js       # Main component
│   │   └── index.js     # Entry point
│   ├── public/          # Static files
│   └── package.json     # Node dependencies
├── .github/             # GitHub configuration
└── README.md            # This file
```

## 🛠️ Development

### Backend Development
```bash
cd backend
# Install in development mode
pip install -e .
# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
# Start development server
npm start
# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[LM Studio](https://lmstudio.ai/)** - For the excellent local LLM runtime
- **[FastAPI](https://fastapi.tiangolo.com/)** - For the modern Python web framework
- **[React](https://reactjs.org/)** - For the powerful frontend library
- **[FontAwesome](https://fontawesome.com/)** - For the beautiful component library

## 📞 Support

- 🐛 [Report Issues](https://github.com/nhexen/veridia/issues)
- 💬 [Discussions](https://github.com/nhexen/veridia/discussions)
- 📧 [Email Support](mailto:support@veridia.dev)

---

**Made for developers who value privacy and control over their AI tools.**
