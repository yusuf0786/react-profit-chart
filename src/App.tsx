import { theme } from './assets/theme/Theme'
import '../src/assets/sass/style.scss'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider } from '@emotion/react';


function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <h1>React Profit Chart</h1>
      </ThemeProvider>
    </>
  )
}

export default App
