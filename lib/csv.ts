import { Company, Customer, OrderData, OrderGroup } from 'types';
import { dateToText, numberToUSD } from '@lib/utils';

type OrderStat = {
  restaurant: {
    name: string;
  };
  quantity: number;
};

type ItemStat = {
  restaurant: {
    name: string;
  };
  item: {
    name: string;
    quantity: number;
  };
};

type PeopleStat = {
  date: string;
  customers: string[];
};

type RestaurantItemsStat = {
  restaurant: string;
  name: string;
  price: number;
};

export const orderCSVHeaders = [
  {
    label: 'Delivery date',
    key: 'deliveryDate',
  },
  {
    label: 'Company',
    key: 'companyName',
  },
  {
    label: 'Shift',
    key: 'shift',
  },
  {
    label: 'First name',
    key: 'firstName',
  },
  {
    label: 'Last name',
    key: 'lastName',
  },
  {
    label: 'Email',
    key: 'customerEmail',
  },
  {
    label: 'Restaurant',
    key: 'restaurantName',
  },
  {
    label: 'Item',
    key: 'itemName',
  },
  {
    label: 'Quantity',
    key: 'quantity',
  },
  {
    label: 'Dietary Tags',
    key: 'tags',
  },
  {
    label: 'Optional addons',
    key: 'optionalAddons',
  },
  {
    label: 'Req. add-on 1',
    key: 'requiredAddonsOne',
  },
  {
    label: 'Req. add-on 2',
    key: 'requiredAddonsTwo',
  },
  {
    label: 'Removed ingredients',
    key: 'removedIngredients',
  },
  {
    label: 'Description',
    key: 'description',
  },
  {
    label: 'Price',
    key: 'price',
  },
];

export const createOrderCSVFileName = (orderGroup: OrderGroup) =>
  `${orderGroup.company.name} - ${orderGroup.deliveryDate.split('T')[0]}.csv`;

export const formatOrderDataToCSV = (orderGroup: OrderGroup) =>
  orderGroup.orders.reduce((acc, curr) => {
    const order = {
      tags: curr.item.tags,
      price: curr.item.total,
      itemName: curr.item.name,
      quantity: curr.item.quantity,
      companyName: curr.company.name,
      lastName: curr.customer.lastName,
      customerEmail: curr.customer.email,
      description: curr.item.description,
      firstName: curr.customer.firstName,
      restaurantName: curr.restaurant.name,
      optionalAddons: curr.item.optionalAddons,
      requiredAddonsOne: curr.item.requiredAddonsOne,
      requiredAddonsTwo: curr.item.requiredAddonsTwo,
      removedIngredients: curr.item.removedIngredients,
      deliveryDate: dateToText(curr.delivery.date),
      shift: `${curr.company.shift[0].toUpperCase()}${curr.company.shift.slice(
        1
      )}`,
    };

    if (order.quantity === 1) {
      return [...acc, { ...order, price: numberToUSD(order.price) }];
    } else {
      let orders = [];
      for (let i = 0; i < order.quantity; i++) {
        orders.push({
          ...order,
          quantity: 1,
          price: numberToUSD(order.price / order.quantity),
        });
      }
      return [...acc, ...orders];
    }
  }, [] as OrderData[]);

export const customerCSVHeaders = [
  {
    label: 'First Name',
    key: 'firstName',
  },
  {
    label: 'Last Name',
    key: 'lastName',
  },
  {
    label: 'Email',
    key: 'email',
  },
  {
    label: 'Status',
    key: 'status',
  },
];

export const createCustomerCSVFileName = (company: Company) =>
  `Customer info - ${
    company.name
  } - ${company.shift[0].toUpperCase()}${company.shift.slice(1)} shift`;

export const formatCustomerDataToCSV = (customers: Customer[]) =>
  customers.map((customer) => ({
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    status: customer.status,
  }));

export const orderStatCSVHeaders = [
  {
    label: 'Restaurant',
    key: 'restaurant',
  },
  {
    label: 'Total Orders',
    key: 'totalOrders',
  },
];

export const formatOrderStatToCSV = (orderStat: OrderStat[]) =>
  orderStat.map((data) => ({
    restaurant: data.restaurant.name,
    totalOrders: data.quantity,
  }));

export const itemStatCSVHeaders = [
  {
    label: 'Restaurant',
    key: 'restaurant',
  },
  {
    label: 'Item Name',
    key: 'item',
  },
  {
    label: 'Quantity Ordered',
    key: 'quantity',
  },
];

export const formatItemStatToCSV = (itemStat: ItemStat[]) =>
  itemStat.map((data) => ({
    restaurant: data.restaurant.name,
    item: data.item.name,
    quantity: data.item.quantity,
  }));

export const peopleStatCSVHeaders = [
  {
    label: 'Date',
    key: 'date',
  },
  {
    label: 'Served',
    key: 'served',
  },
];

export const formatPeopleStatToCSV = (peopleStat: PeopleStat[]) =>
  peopleStat.map((data) => ({
    date: dateToText(data.date),
    served: data.customers.length,
  }));

export const restaurantItemsCSVHeaders = [
  { label: 'Restaurant', key: 'restaurant' },
  { label: 'Item', key: 'item' },
  { label: 'Price', key: 'price' },
];

export const formatRestaurantItemsStat = (
  restaurantItemsStat: RestaurantItemsStat[]
) =>
  restaurantItemsStat.map((item) => ({
    restaurant: item.restaurant,
    item: item.name,
    price: item.price,
  }));

export const reviewStatCSVHeaders = [
  { label: 'Date', key: 'date' },
  { label: 'Restaurant', key: 'restaurant' },
  { label: 'Item', key: 'item' },
  { label: 'Rating', key: 'rating' },
  { label: 'Comment', key: 'comment' },
  { label: 'Customer', key: 'customer' },
  { label: 'Company', key: 'company' },
];
