//------------------------------------------------------------------------------------------------------------------
//declarations 
const container = document.querySelector('.container')
const shuffleButton = document.querySelector('#shuffle')
const levelInput = document.querySelector('#level')
const level = levelInput.options[levelInput.selectedIndex].text


let puzzlePiecesNumber = Number(level)
let puzzlePieces = []
let puzzleBoardHouses = []
let htmlContainer = ''

//-------------------------------------------------------------------------------------------------------------------
//Level panel

levelInput.addEventListener('change', e => {
  puzzlePieces = []
  puzzleBoardHouses = []
  const newLevel = Number(e.target.value)
  removeItem(container, newLevel)
})

const removeItem = (element, newLevel) => {
  while(element.firstChild) {
    element.firstChild.remove();
  }
  makePuzzelBoardObject(newLevel)
  makePuzzelPiecesObject(newLevel)
}


//----------------------------------------------------------------------------------------------------------------------
//Crating puzzle object

const makePuzzelPiecesObject = (puzzlePiecesNumber) => {
  for (let i = 1; i <= puzzlePiecesNumber; i += 1 ) {
    const puzzelPiece = {id: `id${i}`, onBoard: false, text: i, isPlaced: false}
    puzzlePieces.push(puzzelPiece)
  }
  createPuzzleContainer(puzzlePieces)
}


const makePuzzelBoardObject = (puzzlePiecesNumber) => {
  for (let i = 1; i <= puzzlePiecesNumber; i += 1 ) {
    const puzzleBoardHouse = {id: `id${i}`, text: i}
    puzzleBoardHouses.push(puzzleBoardHouse)
  }
  createPuzzleBoard(puzzleBoardHouses)
}

shuffleButton.addEventListener("click",() => {
  window.location.reload();
});


//----------------------------------------------------------------------------------------------------------------------
//creating puzzle dom

const createPuzzleBoard = (puzzlePieces) => {
  htmlContainer +=  `<div class="container-puzzle-board" id="container-puzzle-board">
  ${puzzlePieces.map((puzzelPiece) => {
    return  `<img class="drop-house" src="Image/question-mark.png" id=${puzzelPiece.id}>` 
   })}
  </div>`

  container.innerHTML = htmlContainer
}

const createPuzzleContainer = (puzzlePieces) => {
  puzzlePieces.sort(() => Math.random() - 0.5);
  htmlContainer += `<div class="container-puzzle-pieces" id="container-puzzle-pieces">
     ${puzzlePieces.map((puzzelPiece) => {
      return  `<p 
        class="draggable" draggable="true" text=${puzzelPiece.text} 
        onBoard=${puzzelPiece.onBoard} id=${puzzelPiece.id}> ${puzzelPiece.text}
      </p>` 
     })}
  </div>`
  const html = htmlContainer.replace(/,/g, '')
  container.innerHTML = html
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
      console.log(dropHouse)

      const dragged = document.querySelector('.dragging')
      dragged.classList.remove('.dragging')

      if(dropHouse && dragged) {
        event.preventDefault()
        dragDrop(dropHouse, dragged)
      }
    })
  })
}


const dragDrop = (dropHouse, dragged) => {
  dropHouse.addEventListener('drop', event => {
    replacePuzzle(dropHouse, dragged)
    if(dropHouse.id === dragged.id) {
      modifingPuzzlePieces(dragged.id)
    }  
  })
}


const replacePuzzle = (dropHouse, dragged) => {
  const clone = dragged.cloneNode(true);
  clone.setAttribute('onBoard', true)
  clone.className = ""
  clone.classList.add('drop-house','draggable-after-drop', 'draggable')
  dragged.innerHTML = ""
  dragged.className= ""
  dragged.classList.add('draggable', 'puzzle-piece-after-drop')
  dropHouse.replaceWith(clone)
}

//----------------------------------------------------------------------------------------------------------------------
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
    htmlContainer += '<h3>Congrats You Won! You Must Be Genius or SMT!</h3>'
  }
}
//-----------------------------------------------------------------------------------------------------------------------
window.onload = () => {
  makePuzzelBoardObject(puzzlePiecesNumber)
  makePuzzelPiecesObject(puzzlePiecesNumber)
  dragStart(document.querySelectorAll('.draggable'))
  dragOver(document.querySelectorAll('.drop-house'))
  dragEnd(document.querySelectorAll('.draggable'))
  dragDrop()

}



