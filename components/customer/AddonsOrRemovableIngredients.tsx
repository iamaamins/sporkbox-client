import { ChangeEvent } from 'react';
import {
  Addons,
  AddonsOrRemovableIngredientsType,
  RemovableIngredients,
  SetAddonsOrRemovableIngredients,
} from 'types';
import styles from './Item.module.css';

type Props = {
  data: Addons | RemovableIngredients;
  setData: SetAddonsOrRemovableIngredients;
  dataType: AddonsOrRemovableIngredientsType;
  handleChange: (
    e: ChangeEvent<HTMLInputElement>,
    setData: SetAddonsOrRemovableIngredients,
    dataType: AddonsOrRemovableIngredientsType
  ) => void;
};
export default function AddonsOrRemovableIngredients({
  data,
  setData,
  dataType,
  handleChange,
}: Props) {
  return (
    <div className={styles.addons_or_removable_items}>
      {Object.keys(data).map((el, index) => (
        <div key={index} className={styles.addons_or_removable_item}>
          <input
            type='checkbox'
            name={el}
            id={el}
            checked={data[el]}
            onChange={(e) => handleChange(e, setData, dataType)}
          />
          <label htmlFor={el}>{el}</label>
        </div>
      ))}
    </div>
  );
}
