import { types } from 'mobx-state-tree';
import { range } from 'lodash';

const Easing = types.union(...range(32).map(types.literal));

export default Easing;
