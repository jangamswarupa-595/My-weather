// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


import React from 'react';
import WeatherWidget from './weathercom/WeatherWidget'; // Adjust this import if your WeatherWidget.js is in a different folder
import './weathercom/weather.css';
function App() {
  return (
    <div className="App">
      <WeatherWidget />
    
    <div className="background-image"></div>
      <div className="App" style={{ textAlign: "center" }}>

      </div>
      </div>
  );
}

export default App;