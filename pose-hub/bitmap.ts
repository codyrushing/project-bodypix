type Row = number[]
export type BinaryBitmap = Row[]
type Pixel = [number, number];

// start checking nearby pixels for any empties.  if a nearby pixel is empty, then this is an edge
const offsets = [
  // adjacents
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
  // diagonals
  [-1, -1],
  [-1, 1],
  [1, 1],
  [1, -1]
];

export const getVertices = (b : BinaryBitmap) : number[] => {  
  const vertices = [];

  for(let rowIndex=0; rowIndex<b.length; ++rowIndex){
    const row = b[rowIndex];
    for(let columnIndex=0; columnIndex < row.length; ++columnIndex){
      const p : Pixel = [rowIndex, columnIndex];

      // for a given pixel, search nearby pixels (adjacent first then diagonals) to see if it's an edge
      function isEdge(p : Pixel){
        const [r, c] = p;

        // if it's empty, then it's not an edge
        if(b[r][c] === 0){
          return false;
        }

        // check for empty nearby pixels
        for(const [rOffset, cOffset] of offsets){
          if(b[r+rOffset][c+cOffset] === 0) return true;
        }

        return false;
      }

      function isNextVertex(p : Pixel){
        const [r, c] = p;
        // only non empty pixels can be vertices
        if(b[r][c] === 0){
          return false;
        }
        // is edge of frame
        if(rowIndex === 0 || rowIndex === b.length-1 || columnIndex === 0 || columnIndex === row.length-1){
          return true;
        }
      }

      if(isNextVertex(p)){
        vertices.push(p);
      }
    }
  }
  return vertices;
}