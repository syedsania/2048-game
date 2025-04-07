document.addEventListener('DOMContentLoaded', () => {
    const boardSize = 4;
    const board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    let score = 0;
  
    const gameBoard = document.getElementById('game-board');
    const scoreDisplay = document.getElementById('score');
  
    function initializeBoard() {
      gameBoard.innerHTML = '';
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          const tile = document.createElement('div');
          tile.classList.add('tile');
          tile.setAttribute('data-row', row);
          tile.setAttribute('data-col', col);
          gameBoard.appendChild(tile);
        }
      }
      spawnTile();
      spawnTile();
      updateBoard();
    }
  
    function spawnTile() {
      const emptyTiles = [];
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          if (board[row][col] === 0) {
            emptyTiles.push({ row, col });
          }
        }
      }
      if (emptyTiles.length > 0) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  
    function updateBoard() {
      document.querySelectorAll('.tile').forEach(tile => {
        const row = tile.getAttribute('data-row');
        const col = tile.getAttribute('data-col');
        const value = board[row][col];
        tile.textContent = value === 0 ? '' : value;
        tile.style.backgroundColor = getTileColor(value);
      });
      scoreDisplay.textContent = score;
    }
  
    function getTileColor(value) {
      const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e',
      };
      return colors[value] || '#3c3a32';
    }
  
    function slide(row) {
      const filtered = row.filter(num => num !== 0);
      const zeros = Array(boardSize - filtered.length).fill(0);
      return filtered.concat(zeros);
    }
  
    function combine(row) {
      for (let i = 0; i < boardSize - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          row[i + 1] = 0;
          score += row[i];
        }
      }
      return row;
    }
  
    function operateRow(row) {
      row = slide(row);
      row = combine(row);
      row = slide(row);
      return row;
    }
  
    function rotateBoard(clockwise = true) {
      const newBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          newBoard[c][boardSize - 1 - r] = clockwise ? board[r][c] : board[boardSize - 1 - c][r];
        }
      }
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          board[r][c] = newBoard[r][c];
        }
      }
    }
  
    function move(direction) {
      let boardChanged = false;
      const cloneBoard = board.map(row => [...row]);
  
      if (direction === 'up') rotateBoard(false);
      else if (direction === 'down') rotateBoard();
      else if (direction === 'right') board.forEach(row => row.reverse());
  
      for (let i = 0; i < boardSize; i++) {
        board[i] = operateRow(board[i]);
      }
  
      if (direction === 'up') rotateBoard(true);
      else if (direction === 'down') rotateBoard(false);
      else if (direction === 'right') board.forEach(row => row.reverse());
  
      boardChanged = JSON.stringify(cloneBoard) !== JSON.stringify(board);
  
      if (boardChanged) {
        spawnTile();
        updateBoard();
      }
    }
  
    document.addEventListener('keydown', e => {
      switch (e.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
      }
    });
  
    document.getElementById('reset-btn').addEventListener('click', () => {
      for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
          board[row][col] = 0;
        }
      }
      score = 0;
      spawnTile();
      spawnTile();
      updateBoard();
    });
  
    initializeBoard();
  });
  