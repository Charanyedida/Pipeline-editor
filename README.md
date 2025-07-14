# 🔧 Pipeline Editor

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/new)

> Design, validate, and visualize Directed Acyclic Graphs (DAGs) in an interactive drag-and-drop canvas.

🌐 **Live Demo**: [https://pipeline-editor-green.vercel.app](https://pipeline-editor-green.vercel.app)

---

## ✨ Features

- ✅ Drag-and-drop **custom nodes**
- 🔄 Create **connections** (edges) between nodes
- ❌ **Delete nodes and edges** with keyboard or click
- 📐 Auto **layout adjustment** for better readability
- 🔍 **Validation** to ensure:
  - DAG has at least 2 nodes
  - All nodes are connected
  - Graph is **acyclic**
- 🎨 Clean UI with helpful tooltips and instructions
- 💻 Built with **ReactFlow**, **React**, and deployed on **Vercel**

---

## 📸 Demo Video

![Pipeline Editor Demo Video]([https://user-images.githubusercontent.com/placeholder/screenshot.png](https://drive.google.com/file/d/1jTv_92Fgs5YvmZKtjPBur5e0T8TOqqJS/view?usp=drive_link)) <!-- Replace with real screenshot URL -->

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/pipeline-editor.git
cd pipeline-editor
2. Install dependencies
bash
Copy
Edit
npm install
3. Start the development server
bash
Copy
Edit
npm run dev
# or
npm start
Open http://localhost:3000 to view it in the browser.

🧠 Keyboard Shortcuts
Action	Shortcut
Delete element	Delete or Backspace
Add node	Click "Add Node"
Cancel input	Escape
Confirm input	Enter

🛠 Tech Stack
React – Frontend framework

React Flow – Visual DAG editor

Vercel – Hosting & deployment

CSS Modules – Styling

📦 Folder Structure
bash
Copy
Edit
.
├── public/
├── src/
│   ├── App.js         # Main pipeline editor
│   ├── App.css        # Custom styling
│   └── index.js
├── package.json
└── README.md
🧪 Validation Rules
The editor checks for:

✅ At least 2 nodes

✅ All nodes must be connected

❌ No cycles (must be a valid DAG)

📤 Deployment
Deployed on Vercel:

🔗 https://pipeline-editor-green.vercel.app

To deploy your own:

Fork the repository

Push to GitHub

Import to Vercel

Done! 🚀

👨‍💻 Author
Charan Yedida
🚀 Passionate about building intuitive visual tools and AI-powered web experiences.
