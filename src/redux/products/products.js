import fetchData from '../../utils/fetchData';

const ADD_PRODUCTS = 'ecommerce_scandi/product/ADD_PRODUCTS';
const ADD_CURRENCIES = 'ecommerce_scandi/product/ADD_CURRENCIES';
const ADD_TO_CART = 'ecommerce_scandi/product/ADD_TO_CART';
const REMOVE_FROM_CART = 'ecommerce_scandi/product/REMOVE_FROM_CART';
const CHANGE_CURRENCY = 'ecommerce_scandi/product/CHANGE_CURRENCY';

// Create actions
export function addToCart(payload) {
  return { type: ADD_TO_CART, payload };
}

export function removeBook(payload) {
  return { type: REMOVE_FROM_CART, payload };
}

export function addProducts(payload) {
  return { type: ADD_PRODUCTS, payload };
}

export function addCurrencies(payload) {
  return { type: ADD_CURRENCIES, payload };
}

export function changeCurrency(payload) {
  return { type: CHANGE_CURRENCY, payload };
}

const initialState = {
  cagetories: [{ cat: 'CLOTHES', id: 1 }, { cat: 'TECH', id: 2 }, { cat: 'ALLL', id: 3 }],
  currencies: {},
  activeCurrency: '$',
  cart: [],
  products: {
    clothes: [],
    techs: [],
    all: [],
  },
};

// Define reducer
export default function state(state = initialState, action = {}) {
  const {
    payload,
    type,
  } = action;
  const { cart } = state;
  switch (type) {
    case ADD_CURRENCIES:
      return { ...state, currencies: payload };
    case ADD_TO_CART:
      cart.push(payload);
      return { ...state, cart };
    case REMOVE_FROM_CART:
      return { ...state, cart: cart.fill((product) => product.id !== payload) };
    case ADD_PRODUCTS:
      return payload;
    case CHANGE_CURRENCY:
      return { ...state, activeCurrency: payload };
    default:
      return state;
  }
}

export const fetchProducts = () => async () => {
  const getProducts = `
    {
      categories {
        name
        products {
          id
          name
          inStock
          gallery
          prices {
            currency {
              label,
              symbol
            }
            amount
          }
          description
          attributes {
            name
            type
            items {
              displayValue,
              value,
              id
            }
          }
          brand
        }
      }
    }
  `;
  const result = await fetchData(getProducts);
  // const { currencies } = result.data;
  // dispatach(addCurrencies(currencies));
  // console.log(result, 'Result*********');
};

export const fetchCurrencies = () => async (dispatach) => {
  const getCurrencies = `
    {
      currencies {
        label
        symbol
      }
    }
  `;
  const result = await fetchData(getCurrencies);
  const { currencies } = result.data;
  dispatach(addCurrencies(currencies));
};
