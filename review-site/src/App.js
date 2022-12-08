import Home from './components/pages/Home'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import SidePane from './components/SidePane';
import AdSpace from './components/AdSpace';

const App = () => {
  return (
    <div className='w-full min-h-screen font-display text-slate-600'>
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
          <aside className='min-h-screen basis-1/6'>
            <AdSpace />
          </aside>
        </div>
    </div>
  );
}

export default App
