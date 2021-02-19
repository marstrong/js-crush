// New Game button
$(document).on("click", "#newGame", function (event) {
  game.clearGameboard();
  game.setupGameboard();
  $("#mainColumn").html(game.drawBoard());
  board.resetScore();
});

// Get Hint button
$(document).on("click", "#getHint", function (event) {
  const helpMove = game.getRandomValidMove();
  const cellSize = 600 / board.dimension;
  const arrowLength = cellSize / 4;
  const canvas = document.getElementById("gameCanvas");
  const ctxt = canvas.getContext("2d");
  ctxt.beginPath();
  posY = (helpMove.gem.row + 1) * cellSize;
  posX = helpMove.gem.col * cellSize;
  ctxt.strokeStyle = "black";

  switch (helpMove.direction) {
    case "right":
      $("#mainColumn").html(game.drawBoard());
      posX = posX + cellSize * 1.2;
      posY = posY - cellSize / 2;
      ctxt.moveTo(posX, posY);
      ctxt.lineTo(posX - arrowLength, posY - arrowLength);
      ctxt.lineTo(posX - arrowLength, posY + arrowLength);
      ctxt.fill();
      ctxt.rect(
        posX - arrowLength * 2,
        posY - arrowLength / 2,
        arrowLength,
        arrowLength
      );
      ctxt.fill();
      break;
    case "left":
      $("#mainColumn").html(game.drawBoard());
      posX = posX - cellSize / 4;
      posY = posY - cellSize / 2;
      ctxt.moveTo(posX, posY);
      ctxt.lineTo(posX + arrowLength, posY + arrowLength);
      ctxt.lineTo(posX + arrowLength, posY - arrowLength);
      ctxt.fill();
      ctxt.rect(
        posX + arrowLength,
        posY - arrowLength / 2,
        arrowLength,
        arrowLength
      );
      ctxt.fill();
      break;
    case "up":
      $("#mainColumn").html(game.drawBoard());
      posY = posY - cellSize * 1.2;
      posX = posX + cellSize / 2;
      ctxt.moveTo(posX, posY);
      ctxt.lineTo(posX - arrowLength, posY + arrowLength);
      ctxt.lineTo(posX + arrowLength, posY + arrowLength);
      ctxt.fill();
      ctxt.rect(
        posX - arrowLength / 2,
        posY + arrowLength,
        arrowLength,
        arrowLength
      );
      ctxt.fill();
      break;
    case "down":
      $("#mainColumn").html(game.drawBoard());
      posY = posY + cellSize / 4;
      posX = posX + cellSize / 2;
      ctxt.moveTo(posX, posY);
      ctxt.lineTo(posX + arrowLength, posY - arrowLength);
      ctxt.lineTo(posX - arrowLength, posY - arrowLength);
      ctxt.fill();
      ctxt.rect(
        posX - arrowLength / 2,
        posY - arrowLength * 2,
        arrowLength,
        arrowLength
      );
      ctxt.fill();
      break;
  }
  ctxt.closePath();
});