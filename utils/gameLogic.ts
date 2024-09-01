export type BoardType = number[][];

export const initializeBoard = (): BoardType => {
  const board: BoardType = Array(4).fill(null).map(() => Array(4).fill(0));

  addRandomTile(board);
  addRandomTile(board);

  return board;
};

const addRandomTile = (board: BoardType): BoardType => {
  const emptyTiles = board.flatMap((row, rowIndex) =>
    row.map((tile, colIndex) => (tile === 0 ? { x: rowIndex, y: colIndex } : null))
  ).filter(tile => tile !== null);

  if (emptyTiles.length > 0) {
    const { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]!;
    board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  return board;
};

const moveTiles = (board: BoardType, direction: 'up' | 'down' | 'left' | 'right'): BoardType => {
  let newBoard = board.map(row => row.slice());

  if (direction === 'right') {
    for (let row = 0; row < 4; row++) {
      let newRow = newBoard[row].filter((tile) => tile !== 0);

      if (newRow.length === 0) {
        newBoard[row] = [0, 0, 0, 0];
      } else if (newRow.length === 1) {
        newBoard[row] = [0, 0, 0, newRow[0]];
      } else if (newRow.length === 2) {
        if (newRow[0] === newRow[1]) {
          newBoard[row] = [0, 0, 0, newRow[0] + newRow[1]];
        } else {
          newBoard[row] = [0, 0, newRow[0], newRow[1]];
        }
      } else if (newRow.length === 3) {
        if (newRow[2] === newRow[1]) {
          newBoard[row] = [0, 0, newRow[0], newRow[1] + newRow[2]];
        } else if (newRow[1] === newRow[0]) {
          newBoard[row] = [0, 0, newRow[0] + newRow[1], newRow[2]];
        } else {
          newBoard[row] = [0, newRow[0], newRow[1], newRow[2]];
        }
      } else if (newRow.length === 4) {
        if (newRow[3] === newRow[2]) {
          if (newRow[0] === newRow[1]) {
            newBoard[row] = [0, 0, newRow[0] + newRow[1], newRow[2] + newRow[3]];
          } else {
            newBoard[row] = [0, newRow[0], newRow[1], newRow[2] + newRow[3]];
          }
        } else if (newRow[2] === newRow[1]) {
          newBoard[row] = [0, newRow[0], newRow[1] + newRow[2], newRow[3]];
        } else if (newRow[1] === newRow[0]) {
          newBoard[row] = [0, newRow[0] + newRow[1], newRow[2], newRow[3]];
        } else {
          newBoard[row] = newRow;
        }
      }
    }
  }

  if (direction === 'left') {
    for (let row = 0; row < 4; row++) {
      let newRow = newBoard[row].filter((tile) => tile !== 0);

      if (newRow.length === 0) {
        newBoard[row] = [0, 0, 0, 0];
      } else if (newRow.length === 1) {
        newBoard[row] = [newRow[0], 0, 0, 0];
      } else if (newRow.length === 2) {
        if (newRow[0] === newRow[1]) {
          newBoard[row] = [newRow[0] + newRow[1], 0, 0, 0];
        } else {
          newBoard[row] = [newRow[0], newRow[1], 0, 0];
        }
      } else if (newRow.length === 3) {
        if (newRow[0] === newRow[1]) {
          newBoard[row] = [newRow[0] + newRow[1], newRow[2], 0, 0];
        } else if (newRow[1] === newRow[2]) {
          newBoard[row] = [newRow[0], newRow[1] + newRow[2], 0, 0]
        } else {
          newBoard[row] = [newRow[0], newRow[1], newRow[2], 0];
        }
      } else if (newRow.length === 4) {
        if (newRow[0] === newRow[1]) {
          if (newRow[2] === newRow[3]) {
            newBoard[row] = [newRow[0] + newRow[1], newRow[2] + newRow[3], 0, 0];
          } else {
            newBoard[row] = [newRow[0] + newRow[1], newRow[2], newRow[3], 0];
          }
        } else if (newRow[1] === newRow[2]) {
          newBoard[row] = [newRow[0], newRow[1] + newRow[2], newRow[3], 0];
        } else if (newRow[2] === newRow[3]) {
          newBoard[row] = [newRow[0], newRow[1], newRow[2] + newRow[3], 0];
        } else {
          newBoard[row] = newRow;
        }
      }
    }
  }

  if (direction === 'up') {
    const col1 = [newBoard[0][0], newBoard[1][0], newBoard[2][0], newBoard[3][0]];
    const col2 = [newBoard[0][1], newBoard[1][1], newBoard[2][1], newBoard[3][1]];
    const col3 = [newBoard[0][2], newBoard[1][2], newBoard[2][2], newBoard[3][2]];
    const col4 = [newBoard[0][3], newBoard[1][3], newBoard[2][3], newBoard[3][3]];
    const cols = [col1, col2, col3, col4];

    for (let col = 0; col < 4; col++) {
      let newCol = cols[col].filter((tile) => tile !== 0);

      if (newCol.length === 0) {
        newBoard[1][col] = 0;
        newBoard[2][col] = 0;
        newBoard[3][col] = 0;
      } else if (newCol.length === 1) {
        newBoard[0][col] = newCol[0];
        newBoard[1][col] = 0;
        newBoard[2][col] = 0;
        newBoard[3][col] = 0;
      } else if (newCol.length === 2) {
        if (newCol[0] === newCol[1]) {
          newBoard[0][col] = newCol[0] + newCol[1];
          newBoard[1][col] = 0;
        } else {
          newBoard[0][col] = newCol[0];
          newBoard[1][col] = newCol[1];
        }
        newBoard[2][col] = 0;
        newBoard[3][col] = 0;
      } else if (newCol.length === 3) {
        if (newCol[0] === newCol[1]) {
          newBoard[0][col] = newCol[0] + newCol[1];
          newBoard[1][col] = newCol[2];
          newBoard[2][col] = 0;
        } else if (newCol[1] === newCol[2]) {
          newBoard[0][col] = newCol[0];
          newBoard[1][col] = newCol[1] + newCol[2];
          newBoard[2][col] = 0;
        } else {
          newBoard[0][col] = newCol[0];
          newBoard[1][col] = newCol[1];
          newBoard[2][col] = newCol[2];
        }
        newBoard[3][col] = 0;
      } else if (newCol.length === 4) {
        if (newCol[0] === newCol[1]) {
          if (newCol[2] === newCol[3]) {
            newBoard[0][col] = newCol[0] + newCol[1];
            newBoard[1][col] = newCol[2] + newCol[3];
            newBoard[2][col] = 0;
            newBoard[3][col] = 0;
          } else {
            newBoard[0][col] = newCol[0] + newCol[1];
            newBoard[1][col] = newCol[2];
            newBoard[2][col] = newCol[3];
            newBoard[3][col] = 0;
          }
        } else if (newCol[1] === newCol[2]) {
          newBoard[0][col] = newCol[0];
          newBoard[1][col] = newCol[1] + newCol[2];
          newBoard[2][col] = newCol[2];
          newBoard[3][col] = 0;
        } else if (newCol[2] === newCol[3]) {
          newBoard[0][col] = newCol[0];
          newBoard[1][col] = newCol[1];
          newBoard[2][col] = newCol[2] + newCol[3];
          newBoard[3][col] = 0;
        } else {
          newBoard[0][col] = newCol[0];
          newBoard[1][col] = newCol[1];
          newBoard[2][col] = newCol[2];
          newBoard[3][col] = newCol[3];
        }
      }
    }
  }

  if (direction === 'down') {
    const col1 = [newBoard[0][0], newBoard[1][0], newBoard[2][0], newBoard[3][0]];
    const col2 = [newBoard[0][1], newBoard[1][1], newBoard[2][1], newBoard[3][1]];
    const col3 = [newBoard[0][2], newBoard[1][2], newBoard[2][2], newBoard[3][2]];
    const col4 = [newBoard[0][3], newBoard[1][3], newBoard[2][3], newBoard[3][3]];
    const cols = [col1, col2, col3, col4];

    for (let col = 0; col < 4; col++) {
      let newCol = cols[col].filter((tile) => tile !== 0);

      if (newCol.length === 0) {
        newBoard[0][col] = 0;
        newBoard[1][col] = 0;
        newBoard[2][col] = 0;
        newBoard[3][col] = 0;
      } else if (newCol.length === 1) {
        newBoard[0][col] = 0;
        newBoard[1][col] = 0;
        newBoard[2][col] = 0;
        newBoard[3][col] = newCol[0];
      } else if (newCol.length === 2) {
        if (newCol[0] === newCol[1]) {
          newBoard[0][col] = 0;
          newBoard[1][col] = 0;
          newBoard[2][col] = 0;
          newBoard[3][col] = newCol[0] + newCol[1];
        } else {
          newBoard[0][col] = 0;
          newBoard[1][col] = 0;
          newBoard[2][col] = newCol[0];
          newBoard[3][col] = newCol[1];
        }

      } else if (newCol.length === 3) {
        if (newCol[0] === newCol[1]) {
          newBoard[0][col] = 0;
          newBoard[1][col] = 0;
          newBoard[2][col] = newCol[0] + newCol[1];
          newBoard[3][col] = newCol[2];
        } else if (newCol[1] === newCol[2]) {
          newBoard[0][col] = 0;
          newBoard[1][col] = 0;
          newBoard[2][col] = newCol[0];
          newBoard[3][col] = newCol[1] + newCol[2];
        } else {
          newBoard[0][col] = 0;
          newBoard[1][col] = newCol[0];
          newBoard[2][col] = newCol[1];
          newBoard[3][col] = newCol[2];
        }
      } else if (newCol.length === 4) {
        if (newCol[0] === newCol[1]) {
          if (newCol[2] === newCol[3]) {
            newBoard[0][col] = 0;
            newBoard[1][col] = 0;
            newBoard[2][col] = newCol[0] + newCol[1];
            newBoard[3][col] = newCol[2] + newCol[3];
          } else {
            newBoard[0][col] = 0;
            newBoard[1][col] = newCol[0] + newCol[1];
            newBoard[2][col] = newCol[2];
            newBoard[3][col] = newCol[3];
          }
        } else if (newCol[1] === newCol[2]) {
          newBoard[0][col] = 0;
          newBoard[1][col] = newCol[0];
          newBoard[2][col] = newCol[1] + newCol[2];
          newBoard[3][col] = newCol[3];
        } else if (newCol[2] === newCol[3]) {
          newBoard[0][col] = 0;
          newBoard[1][col] = newCol[0];
          newBoard[2][col] = newCol[1];
          newBoard[3][col] = newCol[2] + newCol[3];
        } else {
          newBoard[0][col] = newCol[0];
          newBoard[1][col] = newCol[1];
          newBoard[2][col] = newCol[2];
          newBoard[3][col] = newCol[3];
        }
      }
    }
  }

  return newBoard;
};

function isGameOver(board: BoardType): boolean {
  // Check for empty cells
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === 0) {
        return false;
      }
    }
  }

  // Check for possible merges horizontally
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === board[i][j + 1]) {
        return false;
      }
    }
  }

  // Check for possible merges vertically
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
      if (board[i][j] === board[i + 1][j]) {
        return false;
      }
    }
  }

  // If no empty cells and no possible merges, game is over
  return true;
};

export { addRandomTile, moveTiles, isGameOver };