import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ElementRef, useEffect, useRef, useState } from 'react';
import './App.css';
import { Cell } from './Utils/Cell.ts';
import { MatrixIndex } from './Utils/MatrixIndex.ts';
import { Point } from './Utils/Point.ts';

function App() {
  let [isStarted, setIsStarted] = useState(false);
  const canvasRef = useRef<ElementRef<'canvas'>>(null);

  const squareSize = 20;
  const numberOfColumns = 60;
  const numberOfRows = 30;
  let cells: Cell[] = [];

  useEffect(() => {
    console.log('canvas rendered !');
    if (canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;


      canvas.width = squareSize * numberOfColumns;
      canvas.height = squareSize * numberOfRows;

      cells = [];

      for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
          const index: MatrixIndex = new MatrixIndex(i, j);
          const point: Point = new Point(j * squareSize, i * squareSize);
          cells.push(new Cell(context, index, point, squareSize, '#ccc'));
        }
      }

      cells.forEach(x => x.draw());
    }
  }, []);

  function highlightGridItemAndNeibour(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    console.log(e);
    const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect();
    let index_x = e.clientX - canvasRect.left;
    let index_y = e.clientY - canvasRect.top;

    let i = Math.floor(index_x / squareSize);
    let j = Math.floor(index_y / squareSize);

    let index = j * numberOfColumns + i;

    cells[index].toggle();

    for (let m = -1; m <= 1; m++) {
      for (let n = -1; n <= 1; n++) {
        if (!(m == 0 && n == 0)) {
          let neibour_x = i + m;
          let neibour_y = j + n;
          if (neibour_x > -1 && neibour_y > -1 && neibour_x < numberOfColumns && neibour_y < numberOfRows) {
            let neibour_index = neibour_y * numberOfColumns + neibour_x;
            if (neibour_index > 0 && neibour_index < cells.length) {
              cells[neibour_index].toggle();
            }
          }
        }
      }
    }
  }

  function startGameOfLife() {
    let cellsToAliveNeibours: Map<number, number> = new Map<number, number>();
    cells.forEach((cell, index) => {
      let numberOfAliveNeibours = 0;
      for (let m = -1; m <= 1; m++) {
        for (let n = -1; n <= 1; n++) {
          if (!(m == 0 && n == 0)) {
            let neibour_x = cell.index.col + m;
            let neibour_y = cell.index.row + n;
            if (neibour_x > -1 && neibour_y > -1 && neibour_x < numberOfColumns && neibour_y < numberOfRows) {
              let neibour_index = neibour_y * numberOfColumns + neibour_x;
              if (neibour_index > 0 && neibour_index < cells.length) {
                if (cells[neibour_index].isAlive) {
                  numberOfAliveNeibours++
                }
              }
            }
          }
        }
      }
      cellsToAliveNeibours.set(index, numberOfAliveNeibours);
    });

    cellsToAliveNeibours.forEach((numberOfAliveNeibours, index) => {
      cells[index].updateBasedOnNeibours(numberOfAliveNeibours);
    })

  }


  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'grid', height: '100vh', gridTemplateRows: '1fr 10fr 1fr', gap: 1 }}>
        <Box sx={{ width: '100vw' }}>
          <Typography variant='h2' sx={{ textAlign: 'center' }}>Game of Life</Typography>
        </Box>
        <Box sx={{ display: 'grid', placeItems: 'center', width: '100vw' }}>
          <canvas ref={canvasRef} onClick={(e) => highlightGridItemAndNeibour(e)}></canvas>
        </Box>
        <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant='contained'
            startIcon={isStarted ? <PauseIcon /> : <PlayArrowIcon />}
            sx={{ m: 1 }}
            onClick={startGameOfLife}
          >
            Start
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default App
