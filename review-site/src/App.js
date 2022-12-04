import Home from './components/pages/Home'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import SidePane from './components/SidePane';

const App = () => {
  return (
    <div className='w-full min-h-screen h-[2000px] font-display text-slate-600'>
        <Header />
        <div className='flex flex-col sm:flex-row h-full'>
          <aside className='h-screen basis-1/6'>
            <SidePane />
          </aside>
          <Router>
            <Routes>
              <Route path='/' element={<Home />} />
            </Routes>
          </Router>
        </div>
    </div>
  );
}

export default App
