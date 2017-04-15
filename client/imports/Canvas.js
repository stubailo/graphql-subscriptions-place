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

const ColorCellMutation = gql`
  mutation ColorCell($input: ColorCellInput!) {
    colorCell(input: $input) {
      cell {
        id
        color { r g b }
      }
    }
  }
`;

const Canvas = ({ data, colorCell }) => {
  if (data.loading || data.error) { return <div />; }

  const size = 5;

  function onClick(event) {
    colorCell({ variables: { input: {
      id: event.target.dataset.id,
      newColor: { r: 200, g: 150, b: 220 },
    }}});
  }

  return (
    <div>
      {
        data.canvas.cells.map(({ id, color: {r, g, b}, location }) => (
          <div
            key={id}
            data-id={id}
            onClick={onClick}
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: `rgb(${r}, ${g}, ${b})`,
              left: `${size * location.x}px`,
              top: `${size * location.y}px`,
              position: 'absolute',
            }}>
          </div>
        ))
      }
    </div>
  );
}

export default compose(
  graphql(GetCanvasQuery),
  graphql(ColorCellMutation, { name: 'colorCell' }),
)(Canvas);
