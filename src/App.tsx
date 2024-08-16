import { Restore } from "@mui/icons-material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SpeedIcon from "@mui/icons-material/Speed";
import { Button, Slider, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { ElementRef, useEffect, useRef, useState } from "react";
import "./App.css";
import { Cell } from "./Utils/Cell.ts";
import { start } from "./Utils/GameOfLife.ts";
import { MatrixIndex } from "./Utils/MatrixIndex.ts";
import { Point } from "./Utils/Point.ts";

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const canvasRef = useRef<ElementRef<"canvas">>(null);
  const squareSizeRef = useRef(20);
  const numberOfColumnsRef = useRef(80);
  const numberOfRowsRef = useRef(33);
  const cellsRef = useRef<Cell[]>([]);

  const timerRef = useRef<number>(0);

  useEffect(() => {
    console.log("canvas rendered !");
    init();
  }, []);

  function init() {
    if (canvasRef.current) {
      const canvas: HTMLCanvasElement = canvasRef.current;
      const context = canvas.getContext("2d") as CanvasRenderingContext2D;

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
          cells.push(new Cell(context, index, point, squareSize, "#494F55"));
        }
      }

      cells.forEach((x) => x.draw());
    }
  }

  useEffect(() => {
    if (isStarted) {
      timerRef.current = setInterval(() => {
        console.log(`timer called !: ${isStarted}`);
        start(
          cellsRef.current,
          numberOfColumnsRef.current,
          numberOfRowsRef.current
        );
      }, 1000 / speed);
      return () => clearInterval(timerRef.current);
    } else {
      clearInterval(timerRef.current);
    }
  }, [isStarted, speed]);

  function toggleCell(e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    const canvas: HTMLCanvasElement = canvasRef.current as HTMLCanvasElement;
    const canvasRect = canvas.getBoundingClientRect();
    const columnNumber = Math.floor(
      (e.clientX - canvasRect.left) / squareSizeRef.current
    );
    const rowNumber = Math.floor(
      (e.clientY - canvasRect.top) / squareSizeRef.current
    );
    const index = rowNumber * numberOfColumnsRef.current + columnNumber;
    cellsRef.current[index].toggle();
  }

  function reset() {
    setIsStarted(false);
    init();
  }

  function adjustSpeed(_event: Event, newValue: number | number[]) {
    setSpeed(newValue as number);
  }

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: "grid",
          height: "100vh",
          gridTemplateRows: "1fr 10fr 1fr",
          gap: 1,
        }}
      >
        <Box sx={{ width: "100vw" }}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", paddingTop: 2, fontWeight: "bold" }}
          >
            Game of Life
          </Typography>
        </Box>
        <Box sx={{ display: "grid", placeItems: "center", width: "100vw" }}>
          <canvas ref={canvasRef} onClick={(e) => toggleCell(e)}></canvas>
        </Box>
        <Box
          sx={{
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            marginBottom: 6,
          }}
        >
          <Button
            variant="contained"
            startIcon={isStarted ? <PauseIcon /> : <PlayArrowIcon />}
            sx={{ m: 1, p: 2 }}
            onClick={() => setIsStarted(!isStarted)}
          >
            Start
          </Button>
          <Box
            sx={{
              width: "20%",
              mx: 4,
              mt: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SpeedIcon sx={{ alignSelf: "center" }} />
            <Slider
              aria-label="Speed"
              value={speed}
              onChange={adjustSpeed}
              marks
              step={1}
              min={1}
              max={5}
            />
          </Box>
          <Button
            variant="contained"
            startIcon={<Restore />}
            sx={{ m: 1, p: 2 }}
            onClick={reset}
          >
            Reset
          </Button>
        </Box>
      </Box>
    </>
  );
}

export default App;
