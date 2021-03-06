import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './header.module.css';
import appLogo from '../assets/images/logo.svg';
import cat from '../assets/images/cat.svg';
import up from '../assets/images/up.svg';
import down from '../assets/images/down.svg';
import ImportedOverlay from './Overlay';
import {
  changeCurrency,
  fetchCurrencies,
  fetchProducts,
  setActiveCategory,
} from '../redux/products/products';

class Header extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      overlayOpen: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencies());
    dispatch(fetchProducts());
    window.onbeforeunload = () => localStorage.setItem('data', JSON.stringify(this.props));
  }

  handleBodyScroll = () => {
    const { overlayOpen } = this.state;
    const { stopScrolling } = styles;
    if (overlayOpen) {
      document.body.classList.remove(stopScrolling);
    } else {
      document.body.classList.add(stopScrolling);
    }
  };

  changeActiveCategory = (name) => {
    const { dispatch } = this.props;
    if (localStorage.getItem('data')) {
      const data = JSON.parse(localStorage.getItem('data'));
      const updatedData = {
        ...data,
        activeCategory: name.toLowerCase(),
      };
      localStorage.setItem('data', JSON.stringify(updatedData));
    }
    dispatch(setActiveCategory(name));
  };

  toggleMenuOpen = () => {
    const { menuOpen } = this.state;
    this.setState({
      menuOpen: !menuOpen,
    });
  };

  toggleOverlayOpen = () => {
    const { overlayOpen } = this.state;
    this.setState({
      overlayOpen: !overlayOpen,
    });
    this.handleBodyScroll();
  };

  toggle = () => {
    this.toggleMenuOpen();
  };

  render() {
    const {
      header,
      navBar,
      navList,
      navItem,
      logo,
      currencyStyle,
      catCurrency,
      cartStyle,
      numOfItemsInCat,
      active,
      dollarDiv,
      currencyArrow,
      currencyListWrapper,
      currencyList,
      arrow,
      catWrapper,
    } = styles;

    const { menuOpen, overlayOpen } = this.state;

    const state = this.props;
    const { activeCategory } = state;

    const { dispatch, categories, cart } = this.props;

    return (
      <section
        role="button"
        tabIndex={0}
        onClick={() => {
          const { overlayOpen, menuOpen } = this.state;
          if (overlayOpen) this.setState({ overlayOpen: false });
          if (menuOpen) this.setState({ menuOpen: false });
          if (overlayOpen) this.handleBodyScroll();
        }}
        onKeyDown={() => this.toggleMenuOpen}
        className={header}
      >
        <nav className={navBar}>
          <ul className={navList}>
            {categories.map((category) => (
              <NavLink
                onClick={() => this.changeActiveCategory(category.name)}
                className={`${navItem} ${
                  category.name.toLowerCase() === activeCategory ? active : ''
                }`}
                key={category.id}
                exact="true"
                to="/"
              >
                <li>{category.name}</li>
              </NavLink>
            ))}
          </ul>
          <img className={logo} src={appLogo} alt="app logo" />
          <div className={catCurrency}>
            <div className={dollarDiv}>
              <div
                role="button"
                tabIndex={0}
                onClick={this.toggleMenuOpen}
                onKeyDown={() => this.toggleMenuOpen}
                className={currencyArrow}
              >
                <p className={currencyStyle}>{state.activeCurrency}</p>
                {menuOpen ? (
                  <img className={arrow} src={up} alt="up arrow" />
                ) : (
                  <img className={arrow} src={down} alt="down arrow" />
                )}
              </div>
              {menuOpen && (
                <div className={currencyListWrapper}>
                  <div className={currencyList}>
                    {state.currencies.map((currency) => (
                      <button
                        key={Math.random()}
                        onClick={() => {
                          dispatch(changeCurrency(currency.symbol));
                          this.toggle();
                        }}
                        type="button"
                      >
                        {currency.symbol}
                        {' '}
                        {currency.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <div
                className={catWrapper}
                role="button"
                tabIndex={0}
                onClick={this.toggleOverlayOpen}
                onKeyDown={() => this.toggleOverlayOpen}
              >
                <img className={cartStyle} src={cat} alt="app logo" />
              </div>
              <span className={numOfItemsInCat}>{cart.length.toLocaleString()}</span>
            </div>
          </div>
        </nav>
        {overlayOpen && (
          <ImportedOverlay
            setState={() => {
              this.setState({ overlayOpen: true });
            }}
            removeOverlay={() => {
              this.setState({ overlayOpen: false });
              this.handleBodyScroll();
            }}
          />
        )}
      </section>
    );
  }
}

function mapStateToProps({ state }) {
  return state;
}

Header.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeCurrency: PropTypes.string.isRequired,
  activeCategory: PropTypes.string.isRequired,
  currencies: PropTypes.instanceOf(Object).isRequired,
  categories: PropTypes.instanceOf(Object).isRequired,
  cart: PropTypes.instanceOf(Object).isRequired,
};

export default connect(mapStateToProps)(Header);
