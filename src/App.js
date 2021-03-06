import { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import history from './history';
import store from './redux/configureStore';
import Header from './components/Header';
import Category from './pages/Category';
import Detail from './pages/Details';
import Cart from './pages/Cart';

class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <Router history={history}>
          <Header />
          <Routes>
            <Route exact path="/" element={<Category />} />
            <Route exact path="/detail" element={<Detail />} />
            <Route exact path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </Provider>
    );
  }
}

export default App;
