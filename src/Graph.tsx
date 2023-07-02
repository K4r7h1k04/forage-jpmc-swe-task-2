import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for Typescript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void,
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through the data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  render() {
    // Render an empty <perspective-viewer> element
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    // Get the <perspective-viewer> element from the DOM
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    // Check if the Perspective library is available
    if (window.perspective) {
      // Create a Perspective table using the schema
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      // Load the `table` into the `<perspective-viewer>` element

      // Add more Perspective configurations here.
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', '{"stock":"distinct count","top_ask_price":"avg","top_bid_price":"avg","timestamp":"distinct count"}');
    }
  }

  componentDidUpdate() {
    // Every time the data prop is updated, insert the data into the Perspective table
    if (this.table) {
      // As part of the task, you need to fix the way we update the data prop to
      // avoid inserting duplicate entries into the Perspective table again.
      this.table.update(this.props.data.map((el: any) => {
        // Format the data from ServerRespond to the schema
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
