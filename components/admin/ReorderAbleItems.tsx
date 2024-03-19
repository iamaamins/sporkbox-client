import Image from 'next/image';
import { Vendor } from 'types';
import { HiBadgeCheck } from 'react-icons/hi';
import { numberToUSD } from '@lib/utils';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import styles from './ReorderAbleItems.module.css';
import {
  swap,
  GridItem,
  GridDropZone,
  GridContextProvider,
} from 'react-grid-dnd';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  vendor: Vendor;
  setVendor: Dispatch<SetStateAction<Vendor | undefined>>;
};

export default function ReorderAbleItems({ vendor, setVendor }: Props) {
  function handleReorder(
    sourceId: string,
    sourceIndex: number,
    targetIndex: number
  ) {
    const updatedItems = swap(
      vendor.restaurant.items,
      sourceIndex,
      targetIndex
    );
    setVendor(
      (prevState) =>
        prevState && {
          ...prevState,
          restaurant: {
            ...prevState.restaurant,
            items: updatedItems,
          },
        }
    );
  }

  return (
    <GridContextProvider onChange={handleReorder}>
      <GridDropZone
        id='items'
        boxesPerRow={3}
        rowHeight={300}
        style={{
          height: 300 * Math.ceil(vendor.restaurant.items.length / 3),
        }}
      >
        {vendor.restaurant.items.map((item) => (
          <GridItem key={item._id}>
            <div className={styles.item}>
              <div className={styles.item_details}>
                <p className={styles.name}>
                  {item.name}
                  {item.status === 'ACTIVE' ? (
                    <HiBadgeCheck />
                  ) : (
                    <RiDeleteBack2Fill className={styles.archive_icon} />
                  )}
                </p>
                <p className={styles.price}>{numberToUSD(item.price)}</p>
                <p className={styles.description}>{item.description}</p>
              </div>

              <div className={styles.item_image}>
                <Image
                  src={item.image || vendor.restaurant.logo}
                  width={16}
                  height={10}
                  objectFit='cover'
                  layout='responsive'
                />
              </div>
            </div>
          </GridItem>
        ))}
      </GridDropZone>
    </GridContextProvider>
  );
}
