import Home from './components/pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header';
import SidePane from './components/SidePane';
import AdSpace from './components/AdSpace';
import WriteReview from './components/pages/WriteReview';
import LoginSignup from './components/pages/LoginSignup';
import DetailView from './components/pages/DetailView';
import EditReview from './components/pages/EditReview';
import Dashboard from './components/pages/Dashboard';
import Profile from './components/pages/Profile';
import Forum from './components/pages/Forum';

const App = () => {
  return (
    <Router>
      <div className='min-h-screen font-display text-body'>
        <Header />
        <div className='flex'>
          <div className='flex-1'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/compose' element={<WriteReview />} />
              <Route path='/Login-Signup' element={<LoginSignup />} />
              <Route path='/review/:id' element={<DetailView />} />
              <Route path='/review/:id/edit' element={<EditReview />} />
              <Route path='/user/:id/dashboard' element={<Dashboard />} />
              <Route path='/user/:id/profile' element={<Profile />} />

              <Route path='/Forum' element={<Forum />} />
              {/* <Route path='*' element={<Error404Page />} /> */}

            </Routes>
          </div>
          <aside className='min-h-screen basis-1/6'>
            <AdSpace />
          </aside>
        </div>
      </div>
    </Router>

    // <Router>
    //   <div className='w-full min-h-screen font-display text-slate-600'>
    //     <Header />
    //     <div className='flex flex-col sm:flex-row h-full'>
    //       <aside className='h-screen basis-1/6'>
    //         <SidePane />
    //       </aside>
    //       <div className='min-h-screen h-fit basis-4/6 bg-gray-100 pt-10'>
    //         <Routes>
    //           <Route path='/' element={<Home />} />
    //           <Route path='/compose' element={<WriteReview />} />
    //         </Routes>
    //       </div>
    //       <aside className='min-h-screen basis-1/6'>
    //         <AdSpace />
    //       </aside>
    //     </div>
    //   </div>
    // </Router>
  );
}

export default App
