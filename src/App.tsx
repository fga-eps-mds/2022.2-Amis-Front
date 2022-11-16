import { ThemeProvider } from "styled-components"
import Theme from './theme'
import AppRoutes from "./routes"

function App() {

  return (
    <ThemeProvider theme={Theme}>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
