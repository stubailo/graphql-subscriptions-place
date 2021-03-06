import React from 'react';
import { graphql, gql, compose } from 'react-apollo';

const GetCanvasQuery = gql`
  query GetCanvas {
    canvas(id: "SYiBQHmebswkp2y47") {
      id
      size { x y }
      cells {
        id
        location { x y }
        color { r g b }
      }
    }
  }
`;

const UpdateCellColorMutation = gql`
  mutation UpdateCellColor($input: UpdateCellColorInput!) {
    updateCellColor(input: $input) {
      cell {
        id
        color { r g b }
      }
    }
  }
`;

const Canvas = ({ data, updateCellColor, color }) => {
  if (data.loading || data.error) {
    return (
      <div className="canvas-placeholder">
        Loading...
      </div>
    );
  }

  const size = 10;

  function onClick(event) {
    updateCellColor({ variables: { input: {
      id: event.target.dataset.id,
      newColor: color,
    }}});
  }

  return (
    <div className="canvas-content">
      {
        data.canvas.cells.map(({ id, color: {r, g, b}, location }) => (
          <div
            className='cell'
            key={id}
            data-id={id}
            onClick={onClick}
            style={{
              backgroundColor: `rgb(${r}, ${g}, ${b})`,
              left: `${size * location.x}px`,
              top: `${size * location.y}px`,
            }}>
          </div>
        ))
      }
    </div>
  );
}

export default compose(
  graphql(GetCanvasQuery),
  graphql(UpdateCellColorMutation, { name: 'updateCellColor' }),
)(Canvas);
