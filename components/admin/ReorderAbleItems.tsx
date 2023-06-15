import Image from "next/image";
import { IReorderAbleItemsProps } from "types";
import { HiBadgeCheck } from "react-icons/hi";
import { formatCurrencyToUSD } from "@utils/index";
import { RiDeleteBack2Fill } from "react-icons/ri";
import styles from "@styles/admin/ReorderAbleItems.module.css";
import {
  swap,
  GridItem,
  GridDropZone,
  GridContextProvider,
} from "react-grid-dnd";

export default function ReorderAbleItems({
  vendor,
  setVendor,
}: IReorderAbleItemsProps) {
  // Handle reorder
  function handleReorder(
    sourceId: string,
    sourceIndex: number,
    targetIndex: number
  ) {
    // Updated items
    const updatedItems = swap(
      vendor.restaurant.items,
      sourceIndex,
      targetIndex
    );

    // Update vendor
    setVendor(
      (currState) =>
        currState && {
          ...currState,
          restaurant: {
            ...currState.restaurant,
            items: updatedItems,
          },
        }
    );
  }

  return (
    <GridContextProvider onChange={handleReorder}>
      <GridDropZone
        id="items"
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
                  {item.status === "ACTIVE" ? (
                    <HiBadgeCheck />
                  ) : (
                    <RiDeleteBack2Fill className={styles.archive_icon} />
                  )}
                </p>
                <p className={styles.price}>
                  {formatCurrencyToUSD(item.price)}
                </p>
                <p className={styles.description}>{item.description}</p>
              </div>

              <div className={styles.item_image}>
                <Image
                  src={item.image || vendor.restaurant.logo}
                  width={16}
                  height={10}
                  objectFit="cover"
                  layout="responsive"
                />
              </div>
            </div>
          </GridItem>
        ))}
      </GridDropZone>
    </GridContextProvider>
  );
}
