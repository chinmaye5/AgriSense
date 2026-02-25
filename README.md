# AgriSense AI: Precision Agriculture Platform

AgriSense AI is an advanced precision agriculture platform designed to empower farmers with data-driven decision-making capabilities. By integrating multi-source agricultural data with state-of-the-art Generative AI and Retrieval Augmented Generation (RAG) technology, the platform provides highly localized crop recommendations, financial projections, and comprehensive farm analytics.

## Core Intelligence Architecture

The platform utilizes a sophisticated RAG (Retrieval Augmented Generation) pipeline to ensure all recommendations are grounded in scientific research and verified agricultural practices.

### Retrieval Augmented Generation (RAG)
AgriSense AI leverages a high-performance vector database (Qdrant) to store and retrieve relevant agricultural documents, research papers, and regional farming guides. This ensures that the AI's suggestions are not just based on general knowledge but are backed by specific, evidence-based data points.

### Large Language Model (LLM) Integration
The system integrates with advanced LLMs to process complex environmental variables and provide natural language justifications for every recommendation. The AI reasons through soil composition, weather patterns, and market trends to deliver actionable insights.

## Key Features

### Smart Crop Recommendations
The platform analyzes over 15 distinct data points to suggest the most suitable crops for a specific field. These include:
- Soil Chemistry: Nitrogen (N), Phosphorus (P), Potassium (K), pH levels, and Organic Carbon.
- Climate Data: Real-time temperature, rainfall patterns, and humidity levels.
- Topography: Elevation, slope, and Digital Elevation Models (DEM).
- Remote Sensing: NDVI (Normalized Difference Vegetation Index) and soil moisture levels via satellite imagery.

### Agricultural AI Chat Advisor
A specialized multilingual chat interface allows farmers to ask complex questions regarding pest management, irrigation schedules, government schemes, and market price fluctuations. The advisor provides detailed, context-aware responses in the user's preferred regional language.

### Comparative Farm Analytics
The dashboard provides visual data representations for:
- Profit Potential Analysis: Estimated maximum and minimum profit ranges per crop.
- Return on Investment (ROI): Financial efficiency forecasts for different crop selections.
- Resource Profiling: NPK requirements and daily water consumption visualizations.
- Financial Integrity Reports: Detailed breakdowns of estimated budget needs and market returns.

## Multilingual Capabilities

AgriSense AI is designed for inclusivity, supporting nine major regional languages to ensure accessibility for farmers across different geographical locations:
- English
- Kannada
- Hindi
- Bengali
- Telugu
- Marathi
- Tamil
- Gujarati
- Punjabi

The platform features full localization for crop names, fertilizer types, and technical justifications, allowing users to interact with advanced technology in their native tongue.

## Technical Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **AI Engine**: OpenAI API with RAG implementation
- **Vector Database**: Qdrant
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Language Management**: Custom Context-based Localization System

## Installation and Setup

### Prerequisites
- Node.js 20 or higher
- Qdrant Cloud Instance or Local Docker Container
- OpenAI API Key

### Configuration
Create a `.env` file in the root directory with the following variables:
```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=your_qdrant_instance_url
QDRANT_API_KEY=your_qdrant_api_key
```

### Deployment
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Development Team

The AgriSense AI project was developed by a dedicated team of engineers focused on leveraging technology for sustainable agriculture:
- Chinmaye HG
- Hruthik Reddy
- Chidurala Manikanta
- Uma Shankar
- Sarvolla Druva
- Saaket Satvik

## Disclaimer

AgriSense AI provides recommendations based on synthesized historical data, real-time climate patterns, and AI reasoning. These projections are indicative and should be verified with local agricultural experts and soil testing laboratories before making significant financial investments or planting decisions. Actual crop performance may vary based on micro-climate variations and precision farming adherence.
