//------------------------------------------------------------------------------------------------------------------
//declarations 
const main = document.querySelector('main')
const panelConatainer = document.querySelector('.panel-container')
const shuffleButton = document.querySelector('#shuffle')
const levelInput = document.querySelector('#level')
const level = levelInput.options[levelInput.selectedIndex].text


let puzzlePiecesNumber = Number(level)
let puzzlePieces = []
let puzzleBoardHouses = []
//let htmlContainer = ''

//-------------------------------------------------------------------------------------------------------------------
//Level panel

levelInput.addEventListener('change', e => {
  
  puzzlePieces = []
  puzzleBoardHouses = []
  puzzlePiecesNumber = Number(e.target.value)
  makePuzzelBoardObject(puzzlePiecesNumber)
  makePuzzelPiecesObject(puzzlePiecesNumber)
  createBoard(puzzlePieces, puzzleBoardHouses, puzzlePiecesNumber)
  dragStart(document.querySelectorAll('.draggable'))
  dragOver(document.querySelectorAll('.drop-house'))
  dragEnd(document.querySelectorAll('.draggable'))

})

//----------------------------------------------------------------------------------------------------------------------
//Crating puzzle object

const makePuzzelPiecesObject = (puzzlePiecesNumber) => {
  for (let i = 1; i <= puzzlePiecesNumber; i += 1 ) {
    const puzzelPiece = {id: `id${i}`, onBoard: false, text: i, isPlaced: false}
    puzzlePieces.push(puzzelPiece)
  }
}


const makePuzzelBoardObject = (puzzlePiecesNumber) => {
  for (let i = 1; i <= puzzlePiecesNumber; i += 1 ) {
    const puzzleBoardHouse = {id: `id${i}`, text: i}
    puzzleBoardHouses.push(puzzleBoardHouse)
  }
}

shuffleButton.addEventListener("click",() => {
  window.location.reload();
});


//----------------------------------------------------------------------------------------------------------------------
//creating puzzle dom



const createBoard = (puzzlePieces, puzzleHouse, level) => {
  const easyLevel = puzzlePiecesNumber && puzzlePiecesNumber === 9
  puzzlePieces.sort(() => Math.random() - 0.5);

  let boardContainer = ""
  boardContainer += `<div class="container">
    <div class=${level === 9 ? "container-puzzle-board-small": "container-puzzle-board-big" } id="container-puzzle-board">
      ${puzzleHouse.map((puzzelPiece) => {
        return `<img class="drop-house ${easyLevel ? 'drop-house-small': 'drop-house-big'}"
        src="Image/question-mark.png" id=${puzzelPiece.id}>` 
      })}
    </div>
    <div class=${easyLevel ? "container-puzzle-pieces-small": "container-puzzle-pieces-big" } id="container-puzzle-pieces">
      ${puzzlePieces.map((puzzelPiece) => {
        return  `<p 
          class="draggable" draggable="true" text=${puzzelPiece.text} 
          onBoard=${puzzelPiece.onBoard} id=${puzzelPiece.id}> ${puzzelPiece.text}
        </p>` 
      })}
    </div>
  </div>`
  const html = boardContainer.replace(/,/g, '')
  main.innerHTML = html
}


//----------------------------------------------------------------------------------------------------------
// Drag functionality

const dragStart = (draggables) => {
 draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
     draggable.classList.add('dragging')
    })
  })
}


const dragEnd = (draggables) => {
  draggables.forEach(draggable => {
    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging')
    })
  })
}

const dragOver = (dropHouses) => {
  dropHouses.forEach(dropHouse => {
    dropHouse.addEventListener('dragover', event => {
      const dragged = document.querySelector('.dragging')
      if(dropHouse && dragged) {
        event.preventDefault()
        dragDrop(dropHouse, dragged)
      }
    })
  })
}


const dragDrop = (dropHouse, dragged) => {
  dropHouse.addEventListener('drop', event => {
    dragged.classList.remove('dragging')

    replacePuzzle(dropHouse, dragged)
    if(dropHouse.id === dragged.id) {
      modifingPuzzlePieces(dragged.id)
    }
  })
}


const replacePuzzle = (dropHouse, dragged) => {
  const easyLevel = puzzlePiecesNumber && puzzlePiecesNumber === 9 
  const draggAbleAfter = easyLevel ? 'draggable-after-drop-small': 'draggable-after-drop-big'

  const newPuzzle = document.createElement("div");
  newPuzzle.classList.add('puzzle-size', 'puzzle-piece-after-drop', 'drop-house')

  const clone = dragged.cloneNode(true);
  clone.setAttribute('onBoard', true)
  clone.innerHTML = dragged.getAttribute('text')
  clone.classList.add('drop-house',draggAbleAfter , 'draggable')
  clone.classList.remove('puzzle-piece-after-drop')
  dropHouse.replaceWith(clone)
  dragged.replaceWith(newPuzzle)
}

//--------------------------------------------------------------------------------------------------------------------
// Finding the Winner!


const modifingPuzzlePieces = (pieceId) => {
  puzzlePieces.forEach(puzzelPiece => {
    if(puzzelPiece.id === pieceId)
    puzzelPiece.isPlaced = true
  })

  getWinner(puzzlePieces)
}

const getWinner = (puzzlePieces) => {
  const winner = puzzlePieces.every(puzzlePiece => puzzlePiece.isPlaced )
  if (winner) {
    panelConatainer.innerHTML ='<h3>Congrats You Won! You Must Be Genius or SMT!</h3>'
  }
}


//-----------------------------------------------------------------------------------------------------------------------
window.onload = () => {
  makePuzzelBoardObject(puzzlePiecesNumber)
  makePuzzelPiecesObject(puzzlePiecesNumber)
  createBoard(puzzlePieces, puzzleBoardHouses, puzzlePiecesNumber)
  dragStart(document.querySelectorAll('.draggable'))
  dragOver(document.querySelectorAll('.drop-house'))
  dragEnd(document.querySelectorAll('.draggable'))
}



