export interface BlockState {
  mine?: boolean
  flagged?: boolean
  adjacentMines: number
  x: number
  y: number
  revealed: boolean
}
