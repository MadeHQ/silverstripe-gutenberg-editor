import { registerStore } from "@wordpress/data";

import reducer from "./reducer";
import * as selectors from "./selectors";
import * as actions from "./actions";
import applyMiddlewares from './middlewares';

const store = registerStore("standalone-gutenberg", {
    reducer,
    actions,
    selectors
});

applyMiddlewares(store);

export default store;
