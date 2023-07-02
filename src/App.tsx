import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

// State declaration for <App />
interface IState {
  data: ServerRespond[];
  showGraph: boolean;
}

// The parent element of the react app.
// It renders the title, button, and Graph react element.
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as an element property.
      data: [],
      showGraph: false,
    };
  }

  // Render Graph react component with state.data parsed as property data.
  renderGraph() {
    // Return the Graph component only if showGraph is true.
    if (this.state.showGraph) {
      return <Graph data={this.state.data} />;
    }
    // If showGraph is false, return null (no component is rendered).
    return null;
  }

  // Get new data from the server and update the state with the new data.
  getDataFromServer() {
    // Fetch data from the server using the DataStreamer module.
    DataStreamer.getData((serverResponds: ServerRespond[]) => {
      // Update the state by creating a new array of data that consists of
      // the previous data in the state and the new data from the server.
      this.setState({ data: [...this.state.data, ...serverResponds] });
    });

    // Initialize a counter variable.
    let x = 0;

    // Set up an interval to continuously fetch data from the server every 100ms.
    const interval = setInterval(() => {
      // Fetch data from the server.
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state with the new data and set showGraph to true.
        this.setState({
          data: serverResponds,
          showGraph: true,
        });
      });

      // Increment the counter variable.
      x++;

      // If the counter exceeds 1000 (indicating a sufficient amount of data has been fetched),
      // clear the interval to stop fetching data.
      if (x > 1000) {
        clearInterval(interval);
      }
    }, 100);
  }

  // Render the App react component.
  render() {
    return (
      <div className="App">
        <header className="App-header">Bank & Merge Co Task 2</header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => {
              // When the button is clicked, call the getDataFromServer function to start streaming data.
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">{this.renderGraph()}</div>
        </div>
      </div>
    );
  }
}

export default App;
