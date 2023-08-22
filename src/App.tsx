import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ElementRef, useEffect, useRef, useState } from 'react';
import './App.css';
import { Cell } from './Utils/Cell.ts';
import { start } from './Utils/GameOfLife.ts';
import { MatrixIndex } from './Utils/MatrixIndex.ts';
import { Point } from './Utils/Point.ts';

function App() {
  let [isStarted, setIsStarted] = useState(false);
  const canvasRef = useRef<ElementRef<'canvas'>>(null);
  const squareSizeRef = useRef(20);
  const numberOfColumnsRef = useRef(80);
  const numberOfRowsRef = useRef(33);
  const cellsRef = useRef<Cell[]>([]);

  let timerRef = useRef<number>(0);

  useEffect(() => {
    console.log('canvas rendered !');
    init();
  }, []);

  function init() {
    if (canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context = canvas.getContext('2d') as CanvasRenderingContext2D;

      const numberOfColumns = numberOfColumnsRef.current;
      const numberOfRows = numberOfRowsRef.current;
      const squareSize = squareSizeRef.current;

      canvas.width = squareSize * numberOfColumns;
      canvas.height = squareSize * numberOfRows;

      const cells: Cell[] = cellsRef.current;
      cells.length = 0;

      for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
          const index: MatrixIndex = new MatrixIndex(i, j);
          const point: Point = new Point(j * squareSize, i * squareSize);
          cells.push(new Cell(context, index, point, squareSize, '#494F55'));
        }
      }

      cells.forEach(x => x.draw());
    }
  }

  useEffect(() => {
    if (isStarted) {
      timerRef.current = setInterval(() => {
        console.log(`timer called !: ${isStarted}`);
        start(cellsRef.current, numberOfColumnsRef.current, numberOfRowsRef.current);
      }, 1000);
      return () => clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
  }, [isStarted]);

  function toggleCell(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect();
    const columnNumber = Math.floor((e.clientX - canvasRect.left) / squareSizeRef.current);
    const rowNumber = Math.floor((e.clientY - canvasRect.top) / squareSizeRef.current);
    const index = rowNumber * numberOfColumnsRef.current + columnNumber;
    cellsRef.current[index].toggle();
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'grid', height: '100vh', gridTemplateRows: '1fr 10fr 1fr', gap: 1 }}>
        <Box sx={{ width: '100vw' }}>
          <Typography variant='h2' sx={{ textAlign: 'center', paddingTop: 2, fontWeight: 'bold' }}>Game of Life</Typography>
        </Box>
        <Box sx={{ display: 'grid', placeItems: 'center', width: '100vw' }}>
          <canvas ref={canvasRef} onClick={(e) => toggleCell(e)}></canvas>
        </Box>
        <Box sx={{ width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginBottom: 6 }}>
          <Button
            variant='contained'
            startIcon={isStarted ? <PauseIcon /> : <PlayArrowIcon />}
            sx={{ m: 1, p: 2 }}
            onClick={() => setIsStarted(!isStarted)}
          >
            Start
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default App
