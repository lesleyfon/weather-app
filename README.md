
# Weather Time Machine 🌤️ ⏰

A modern web application that enables users to compare weather conditions between different dates at any location. Built with Remix, TypeScript, and powered by Visual Crossing Weather API and Google Places API for location search.

![Home Page](./app//assets/img/Screenshot%202025-01-13%20at%2011.36.41 AM.png)
![Graph Comparison for temperature between two dates](./app//assets/img/Screenshot%202025-01-13%20at%2011.35.35 AM.png)
![Table Comparing Min and Max Temperatures](./app//assets/img/Screenshot%202025-01-13%20at%2011.35.55 AM.png)
![Table Comparing Hourly Temperatures](./app/assets/img/Screenshot%202025-01-13%20at%2011.36.08 AM.png)




## Features 🚀

### Location Search
- **Smart Autocomplete**: Powered by Google Places API
- **Global Coverage**: Search for any location worldwide
- **Coordinate Precision**: Uses exact latitude/longitude for accurate weather data

### Weather Comparison
- **Date Selection**: Compare weather between any two dates
- **Detailed Metrics**:
  - Temperature (°F)
  - Precipitation
  - Humidity
  - Wind Speed
  - Cloud Cover
  - Weather Conditions

### Visual Data
- **Interactive Charts**: Built with Recharts
- **Side-by-Side Comparison**: Easy to read comparative data
- **Custom Weather Icons**: Visual representation of weather conditions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack 💻

- **Framework**: [Remix](https://remix.run/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **APIs**:
  - Visual Crossing Weather API
  - Google Places API
- **Charts**: Recharts
- **Testing**: Vitest [In progress🚧🚧]

## Getting Started 🏁

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- API Keys:
  - Visual Crossing Weather API
  - Google Places API

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/lesleyfon/weather-app.git
  ```

2. Install dependencies:
  ```bash
  npm install
  ``` 

3. Create a `.env` file in the root directory: 
```bash
GOOGLE_API_KEY=your_google_api_key
WEATHER_VISUAL_CROSSING_API_KEY=your_weather_api_key
```

4. Start the development server:

```bash
npm run dev
```


## Usage 📖

1. **Select a Location**
   - Use the search bar to find your desired location
   - Autocomplete will help you select the exact place

2. **Choose Dates**
   - Pick two dates you want to compare
   - Historical data available from 1900
   - Future dates are disabled

3. **View Comparison**
   - See side-by-side weather metrics
   - Interactive charts show temperature variations
   - Detailed hourly breakdowns available

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments 🙏

- Visual Crossing Weather API for providing weather data
- Google Places API for location services
- Remix team for the amazing framework
- All contributors who help improve this project


## Contact 📧
Project Link: [https://github.com/lesleyfon/weather-app](https://github.com/lesleyfon/weather-app)
Deployed on [https://tempswap.vercel.app/](https://tempswap.vercel.app/)


---

Made with ❤️ and ☕