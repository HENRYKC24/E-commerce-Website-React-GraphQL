import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import styles from './category.module.css';
import noImage from '../assets/images/no_image.webp';
import {
  addSelectedProduct,
  fetchCurrencies,
  fetchProducts,
} from '../redux/products/products';
import PLPAddToCartOverlay from '../components/PLPAddToCartOverlay';
import formatFigure from '../utils/formatFigure';

class Category extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showAddToCartOverlay: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCurrencies());
    dispatch(fetchProducts());
  }

  updateReduxWithSelectedProduct = (product) => {
    const productWithBtnText = { ...product, btnContent: 'ADD TO CART' };
    const { dispatch } = this.props;
    dispatch(addSelectedProduct(productWithBtnText));
  };

  addDefaultSrc = (e) => {
    e.target.src = noImage;
  };

  render() {
    const {
      listContainer,
      catName,
      listItems,
      listItem,
      image,
      imageOut,
      dataName,
      amount,
      link,
      grey,
      outOfStock,
      under,
      addToCart,
    } = styles;

    const state = this.props;
    const { activeCategory } = state;
    const { all } = state.products;
    let currentProducts;
    let activeCurrency;

    if (all[0]) {
      currentProducts = state.products[activeCategory];
      const currency = state.activeCurrency;
      activeCurrency = currency;
    }

    const { showAddToCartOverlay } = this.state;

    return (
      <section className={listContainer}>
        {all[0] ? (
          <>
            <h3 className={catName}>{activeCategory.toUpperCase()}</h3>
            <ul className={listItems}>
              {state.categories[0]
                ? currentProducts.map((singleData) => (
                  <li
                    className={`${listItem} ${
                      singleData.inStock ? '' : grey
                    }`}
                    key={Math.random()}
                  >

                    <div
                      role="button"
                      tabIndex={0}
                      onKeyDown={() => this.updateReduxWithSelectedProduct(singleData)}
                      onClick={() => this.updateReduxWithSelectedProduct(singleData)}
                      className={imageOut}
                    >

                      {!singleData.inStock && (
                        <p className={outOfStock}>OUT OF STOCK</p>
                      )}
                      <div className={image}>
                        <NavLink
                          className={link}
                          exact="true"
                          to="/detail"
                        >
                          <img
                            onError={this.addDefaultSrc}
                            className={image}
                            src={singleData.gallery[0]}
                            alt={singleData.name}
                          />
                        </NavLink>
                      </div>

                    </div>
                    <div className={under}>
                      <div>
                        <p className={dataName}>{singleData.name}</p>
                        <p className={amount}>
                          <strong>
                            {activeCurrency}
                            {' '}
                            {
                               formatFigure(
                                 singleData.prices.filter(
                                   (price) => price.currency.symbol === activeCurrency,
                                 )[0].amount,
                               )
                              }
                          </strong>
                        </p>
                      </div>
                      <div>
                        {singleData.inStock && (
                        <button
                          onClick={() => {
                            this.updateReduxWithSelectedProduct(singleData);
                            this.setState({ showAddToCartOverlay: true });
                          }}
                          className={addToCart}
                          type="button"
                        >
                          Add To Cart
                        </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))
                : null}
            </ul>
          </>
        ) : null}
        {showAddToCartOverlay && (
        <PLPAddToCartOverlay setState={() => {
          this.setState({ showAddToCartOverlay: false });
        }}
        />
        )}
      </section>
    );
  }
}

Category.propTypes = {
  dispatch: PropTypes.func.isRequired,
  activeCurrency: PropTypes.string.isRequired,
  activeCategory: PropTypes.string.isRequired,
  products: PropTypes.instanceOf(Array).isRequired,
  categories: PropTypes.instanceOf(Array).isRequired,
};

function mapStateToProps({ state }) {
  return state;
}

export default connect(mapStateToProps)(Category);
