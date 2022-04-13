class Connect4 {
  constructor(selector) {
    this.ROWS = 6;
    this.COLS = 7;
    this.player = 'red';//addded player attribute to the class will be either red or black
    this.selector = selector;
    this.isGameOver = false;
    this.onPlayerMove = function() {};
    this.createGrid();
    this.setupEventListeners();
  }

  createGrid() {
    const $board = $(this.selector);
    $board.empty();
    this.isGameOver = false;
    this.player = 'red';
    for (let row = 0; row < this.ROWS; row++) {
      const $row = $('<div>')
        .addClass('row');
      for (let col = 0; col < this.COLS; col++) {
        const $col = $('<div>')
          .addClass('col empty')
          .attr('data-col', col)// for the indicator piece function below
          .attr('data-row', row);// for the indicator piece function below
        $row.append($col);
      }
      $board.append($row);
    }
  }
    //function (called in the class above) to hover over grid and produce a colour:
  setupEventListeners() {
    //indicator where piece will drop:
    const $board = $(this.selector);
    const that = this; // to help with the switching between players

    function findLastEmptyCell(col) {
      const cells = $(`.col[data-col='${col}']`);
      for (let i = cells.length - 1; i >= 0; i--) {
        //loop through every empty row backwards: >=    
        const $cell = $(cells[i]);
        if ($cell.hasClass('empty')) {
          return $cell;
        }
      }
      return null;
    }
//JQuery method event to this to second. arg is where it will take place:col and then we will call function (only allows for the bottom piece of the grid to selected)
    $board.on('mouseenter', '.col.empty', function() {
      if (that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.addClass(`next-${that.player}`);//to remove hover effect 
    });

    $board.on('mouseleave', '.col', function() {
      $('.col').removeClass(`next-${that.player}`);
    });
//click on cell to put in piece
    $board.on('click', '.col.empty', function() {
      if (that.isGameOver) return;
      const col = $(this).data('col');
      const $lastEmptyCell = findLastEmptyCell(col);
      $lastEmptyCell.removeClass(`empty next-${that.player}`);//to indicate who the next player is
      $lastEmptyCell.addClass(that.player);
      $lastEmptyCell.data('player', that.player);
//to help with finding out who the winner:
      const winner = that.checkForWinner(
        $lastEmptyCell.data('row'), 
        $lastEmptyCell.data('col')
      )
      if (winner) {
        that.isGameOver = true;
//alert for winner of the game
        alert(`Game Over! Player ${that.player} has won!`);
        $('.col.empty').removeClass('empty');
        return;
      }

      that.player = (that.player === 'red') ? 'black' : 'red'; //to switch between the players &: 
      that.onPlayerMove();
      $(this).trigger('mouseenter');
    });
  }
//to check for the winner function has two parameters: row and col you last clicked
  checkForWinner(row, col) {
    const that = this;

    function $getCell(i, j) {
      return $(`.col[data-row='${i}'][data-col='${j}']`);
    }

    function checkDirection(direction) {
      let total = 0;
      let i = row + direction.i;
      let j = col + direction.j;
      let $next = $getCell(i, j);
      while (i >= 0 &&
        i < that.ROWS &&
        j >= 0 &&
        j < that.COLS && 
        $next.data('player') === that.player
      ) {
        total++;
        i += direction.i;
        j += direction.j;
        $next = $getCell(i, j);
      }
      return total;
    }

    function checkWin(directionA, directionB) {
//checking for win by passing up and down
      const total = 1 +
        checkDirection(directionA) +
        checkDirection(directionB);
      if (total >= 4) {
        return that.player;
      } else {
        return null;
      }
    }

    function checkDiagonalBLtoTR() {
      return checkWin({i: 1, j: -1}, {i: 1, j: 1});
    }

    function checkDiagonalTLtoBR() {
      return checkWin({i: 1, j: 1}, {i: -1, j: -1});
    }
  //to check all rows&cols for 4 in a row:

    function checkVerticals() {
      return checkWin({i: -1, j: 0}, {i: 1, j: 0});
    }

    function checkHorizontals() {
      return checkWin({i: 0, j: -1}, {i: 0, j: 1});
    }

    return checkVerticals() || 
      checkHorizontals() || 
      checkDiagonalBLtoTR() ||
      checkDiagonalTLtoBR();
  }

  restart () {
    this.createGrid();
    this.onPlayerMove();
  }
}